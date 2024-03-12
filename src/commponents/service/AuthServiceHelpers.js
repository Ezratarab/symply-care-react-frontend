import { jwtDecode } from "jwt-decode";

class AuthServiceHelpers {
    getCurrentUser() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            const decodedToken = jwtDecode(user.accessToken);
            return decodedToken;
        }
        return null;
    }

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
    


    isAuthenticated() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user && user.accessToken;
    }

    getAccessToken() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.accessToken : null;
    }

    isTokenExpired(token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp < Date.now() / 1000; 
        } catch (err) {
            console.log('Expired check failed');
            return true;
        }
    }

    setTokens(accessToken, refreshToken) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            localStorage.setItem('user', JSON.stringify(user));
        }
    }
}

const authServiceInstance = new AuthServiceHelpers(); 
export default authServiceInstance;  

