import React, { useEffect } from 'react';  // Import useEffect hook
import { useNavigate } from 'react-router-dom';
import '../CSS/ProtectedPage.css';
import AuthWrapper from '../Services/AuthWrapper';
import AuthServiceHelpers from "../Services/AuthServiceHelpers";

const isAdmin = () => {
    const userRole = AuthServiceHelpers.getUserRole();
    return userRole && userRole === 'ROLE_ADMIN';
};

const AdminProtectedPage = () => {
    const navigate = useNavigate();

    // Use the useEffect hook to handle side effects
    useEffect(() => {
        // only admins can access this page, so redirect to the user protected page if the user is not an admin
        if (!isAdmin()) {
            // If not an admin, navigate to the user-protected page
            navigate("/user-protected");
        }
    }, [navigate]);  // List 'navigate' as a dependency, so the effect runs only when it changes

    // If not an admin, render nothing until the redirect happens
    if (!isAdmin()) {
        return null;
    }

    return (
        <AuthWrapper>
            <div className="protected-page-container">
                <div className="protected-page-content">
                    <div className="protected-page-warning">🚫</div>
                    <h1 className="protected-page-heading">Access Only for ADMIN users</h1>
                    <p>You have permission to view this page.</p>
                </div>
            </div>
        </AuthWrapper>
    );
};

export default AdminProtectedPage;
