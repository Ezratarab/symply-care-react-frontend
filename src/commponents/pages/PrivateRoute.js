// This module defines a `PrivateRoute` component which acts as a custom, protected route.
// The primary purpose is to restrict access to certain parts of an application based on
// whether a user is authenticated or not.

import React from 'react';
import { Navigate } from 'react-router-dom'; // Import the Navigate component from react-router-dom which allows for redirects.

import AuthServiceHelpers from "../Services/AuthServiceHelpers";

// Define the `PrivateRoute` functional component. It takes a prop named 'element'.
// The 'element' prop typically represents a React element (like a page or view)
// In the provided code, the element prop for the PrivateRoute component can be either <HomePage /> or <AdminProtectedPage />,
// depending on the route being defined. For example, the element prop for the "/" route is <HomePage />.
// that should be rendered if the user is authenticated.
function PrivateRoute({ element }) {
  // Call the `isAuthenticated` method from the AuthServiceHelpers module to check
  // if the user is authenticated.
  const isAuthenticated = AuthServiceHelpers.isAuthenticated();

  if (isAuthenticated) {
    // If the user is authenticated, render the provided React element.
    return element;
  } else {
    // If the user is not authenticated, redirect them to the "/login" route.
    // The 'replace' prop ensures the current location is replaced by the target location in the history stack.
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;

// {element} is a prop that represents a React element (e.g., JSX) that should be rendered if the user is authenticated.
// In the provided code, the element prop for the PrivateRoute component can be either <HomePage /> or <AdminProtectedPage />,
// depending on the route being defined. For example, the element prop for the "/" route is <HomePage />.
// The element prop in this context is likely a React element (e.g., JSX)
// that represents a component or page you want to render.
// When you use the PrivateRoute component, you would pass the component or page you want to protect
// (render conditionally based on authentication status) as the element prop. If the user is authenticated,
// this element would be rendered. If not, the user would be redirected to the login page.
