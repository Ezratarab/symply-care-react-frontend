import React from 'react';
import '../CSS/ProtectedPage.css';
import AuthWrapper from '../Services/AuthWrapper'; // Import the AuthWrapper component

const UserProtectedPage = () => {
    return (
        <AuthWrapper>
            <div className="protected-page-container">
                <div className="protected-page-content">
                    <div className="protected-page-warning">🚫</div>
                    <h1 className="protected-page-heading">User Protected Page</h1>
                    <p>This page is only accessible to ADMIN and USERS users.</p>
                </div>
            </div>
        </AuthWrapper>
    );
};

export default UserProtectedPage;
