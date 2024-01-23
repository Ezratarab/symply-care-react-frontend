import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthServiceAxios';
import AuthServiceHelpers from "../Services/AuthServiceHelpers";
import axios from "axios";

const API_URL = 'https://localhost:8443';

const logout = () => {
    AuthService.logout(); // Logout the user
    window.location.reload(); // Refresh the page to update UI
};

const AuthWrapper = ({ children }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthenticationAndNavigate = async () => {
            // [Rest of your existing logic...]
            try {
                const user = AuthServiceHelpers.getCurrentUser();
                console.log('User:', user);
                console.log('User role:', AuthServiceHelpers.getUserRole());
                if (!user) {
                    // Navigate to the login page if the user is not authenticated
                    navigate('/login');
                    setIsLoading(false);
                    return;
                }

                // else, check if the access token is expired
                if (AuthService.getRefreshToken()) {
                    console.log('Checking if access token is expired')
                    if (AuthServiceHelpers.isTokenExpired(AuthServiceHelpers.getAccessToken())) {
                        console.log('Access token is expired, refreshing token...');
                        const response = await axios.post(`${API_URL}/refresh_token`,
                            {
                                refreshToken: AuthService.getRefreshToken(),
                            },
                            {
                                headers: {
                                    'Authorization': `Bearer ${AuthServiceHelpers.getAccessToken()}`
                                }
                            }
                        );
                        // if we got a new access token, set the new access and refresh tokens in local storage
                        if (response.data.accessToken) {
                            console.log('Access token refreshed successfully');
                            AuthServiceHelpers.setTokens(
                                response.data.accessToken,
                                response.data.refreshToken
                            );
                        }

                        // else, logout the user and clear tokens from local storage, if the refresh token is expired
                        else if (response.data === "Refresh token has expired, please login again") {
                            console.error("Refresh token expired, please login again");
                            logout(); // Logout the user and clear tokens from local storage
                        }
                        // else, throw any other error message received from the server
                        else {
                            throw new Error(response.data); // Throw the error message received from the server
                        }
                    } else {
                        console.log('Access token is not expired yet');
                    }
                }

                // islanding complete, set the loading state to false
                setIsLoading(false);
            } catch (error) {
                console.error("Error during authentication check:", error.message);

                // Check if the error response is available, if we get a 401 response, the refresh token is expired from the server
                if (error.response || error.response.status === 401 ||
                    error.response.data === "Refresh token has expired, please login again") {
                    console.error("Refresh token expired, please login again");
                }

                // and logout the user and clear tokens from local storage
                logout(); // Logout the user
                setIsLoading(false);
            }

        };

        checkAuthenticationAndNavigate().then(r => console.log('Authentication check complete'));
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return children;
};

export default AuthWrapper;
