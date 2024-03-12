import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation hook
import AuthService from "./APIService";
import AuthServiceHelpers from "./AuthServiceHelpers";
import axios from "axios";

const API_URL = "https://localhost:8080";

const logout = () => {
  AuthService.logout();
  window.location.reload();
};

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthenticationAndNavigate = async () => {
      console.log("UserRole:", AuthServiceHelpers.getUserRole());
      console.log("Pathname:", location.pathname);
      if (AuthServiceHelpers.getUserRole() === "DOCTOR") {
        if (location.pathname.startsWith("/patients")) {
          navigate("/");
          console.log("donttttttttttttttttt");
          setIsLoading(false);
          return;
        }
      }
      if (AuthServiceHelpers.getUserRole() === "PATIENT") {
        if (location.pathname.startsWith("/doctors")) {
          navigate("/");
          console.log("donttttttttttttttttt");
          setIsLoading(false);
          return;
        }
      }

      if (
        AuthServiceHelpers.getUserRole() === null &&
        (location.pathname.startsWith("/doctors") ||
          location.pathname.startsWith("/patients"))
      ) {
        navigate("/");
        setIsLoading(false);
        return;
      }
      try {
        const user = AuthServiceHelpers.getCurrentUser();
        console.log("User:", user);
        console.log("User role:", AuthServiceHelpers.getUserRole());
        if (!user) {
          navigate("/login");
          setIsLoading(false);
          return;
        }

        if (AuthService.getRefreshToken()) {
          console.log("Checking if access token is expired");
          if (
            AuthServiceHelpers.isTokenExpired(
              AuthServiceHelpers.getAccessToken()
            )
          ) {
            console.log("Access token is expired, refreshing token...");
            const response = await axios.post(
              `${API_URL}/refresh_token`,
              {
                refreshToken: AuthService.getRefreshToken(),
              },
              {
                headers: {
                  Authorization: `Bearer ${AuthServiceHelpers.getAccessToken()}`,
                },
              }
            );
            if (response.data.accessToken) {
              console.log("Access token refreshed successfully");
              AuthServiceHelpers.setTokens(
                response.data.accessToken,
                response.data.refreshToken
              );
            } else if (
              response.data === "Refresh token has expired, please login again"
            ) {
              console.error("Refresh token expired, please login again");
              logout();
            } else {
              throw new Error(response.data);
            }
          } else {
            console.log("Access token is not expired yet");
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error during authentication check:", error.message);

        if (
          error.response ||
          error.response.status === 401 ||
          error.response.data ===
            "Refresh token has expired, please login again"
        ) {
          console.error("Refresh token expired, please login again");
        }

        logout();
        setIsLoading(false);
      }
    };
    checkAuthenticationAndNavigate().then((r) =>
      console.log("Authentication check complete")
    );
  }, [navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default AuthWrapper;
