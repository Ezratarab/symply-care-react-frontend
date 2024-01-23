// Import necessary modules
import axios from 'axios';
import AuthService from '../service/APIService';
import AuthServiceHelpers from "../services/AuthServiceHelpers";

const API_URL = 'http://localhost:8080';

// Initialize variables to manage token refresh
let refreshTokenInterval = null; // Variable to store the interval for token refresh

// Define the TokenRefresh object
const TokenRefresh = {
    // Start method to initiate a token refresh process
    start: () => {
        if (!refreshTokenInterval) {
            console.log('Starting token refresh');
            // Set up an interval for token refresh
            refreshTokenInterval = setInterval(async () => {
                try {
                    // check if refresh token exists
                    if (AuthService.getRefreshToken()) {
                        // Check if the access token is expired
                        console.log('Checking if access token is expired')
                        if (AuthServiceHelpers.isTokenExpired(AuthServiceHelpers.getAccessToken())) {
                            console.log('Access token is expired, refreshing token...');
                            // If the access token is expired, attempt token refresh
                            const response = await axios.post(`${API_URL}/refresh_token`, {
                                refreshToken: AuthService.getRefreshToken(),
                            });
                            if (response.data.accessToken) {
                                // If refresh is successful, update tokens in AuthService
                                AuthServiceHelpers.setTokens(
                                    response.data.accessToken,
                                    response.data.refreshToken
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.log('Error refreshing token:', error);
                }
            }, 10000); // check for may Refresh needed, every 10000ms = 10s
        }
    },

    // Stop method to clear the token refresh interval
    stop: () => {
        if (refreshTokenInterval) {
            clearInterval(refreshTokenInterval); // Clear the interval if it's running
            refreshTokenInterval = null; // Reset the interval variable
        }
    },

};

export default TokenRefresh; // Export the TokenRefresh object
