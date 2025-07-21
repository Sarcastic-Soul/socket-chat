import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    // Initialize state from localStorage to keep the user logged in across sessions
	const [authUser, setAuthUser] = useState(() => {
        const storedUser = localStorage.getItem("chat-user");
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse auth user from localStorage", error);
            localStorage.removeItem("chat-user"); // Clear corrupted data
            return null;
        }
    });

    // Create a new function that wraps setAuthUser to also update localStorage
    const updateAuthUser = (user) => {
        if (user) {
            localStorage.setItem("chat-user", JSON.stringify(user));
        } else {
            // This handles logout
            localStorage.removeItem("chat-user");
        }
        setAuthUser(user);
    };

	return <AuthContext.Provider value={{ authUser, setAuthUser: updateAuthUser }}>{children}</AuthContext.Provider>;
};
