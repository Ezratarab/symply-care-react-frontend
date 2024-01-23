import { jwtDecode } from "jwt-decode";

class AuthServiceHelpers {


    // helper method, Get current user from local storage
    getCurrentUser() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            const decodedToken = jwtDecode(user.accessToken);
            return decodedToken;
        }
        return null;
    }

    // helper method, Get user role from token
    getUserRole() {
        const currentUser = this.getCurrentUser();
        console.log(currentUser);
        console.log('Decoded JWT:', currentUser);

        if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
            console.log('User role:', currentUser.roles[0]);
            return currentUser.roles[0];
        }

        console.warn('User role not found.');
        return null;
    }


// helper method, Check if user is authenticated
    isAuthenticated() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user && user.accessToken;
    }

// helper method, Get access token
    getAccessToken() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.accessToken : null;
    }

    // helper method, Check if token is expired
    isTokenExpired(token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp < Date.now() / 1000; // Check if the token has expired
        } catch (err) {
            console.log('Expired check failed');
            return true;
        }
    }

// helper method, Set tokens in local storage
    setTokens(accessToken, refreshToken) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            localStorage.setItem('user', JSON.stringify(user));
        }
    }
}

const authServiceInstance = new AuthServiceHelpers(); // Create an instance of AuthServiceAxios
export default authServiceInstance;  // Export the instance as the default export

