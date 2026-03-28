import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuthContext } from "./context/AuthContext";
import ProfilePage from "./pages/Profile";
import UserProfilePage from "./pages/UserProfile";
import GroupInfo from "./pages/GroupInfo";
import { Box } from "@mantine/core";

function App() {
    const { authUser } = useAuthContext();

    return (
        <Box
            style={{
                minHeight: "100vh",
                // Provides a slightly tinted background depending on light/dark mode
                backgroundColor:
                    "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))",
            }}
        >
            <Routes>
                <Route
                    path="/"
                    element={authUser ? <Home /> : <Navigate to={"/login"} />}
                />
                <Route
                    path="/login"
                    element={authUser ? <Navigate to="/" /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={authUser ? <Navigate to="/" /> : <SignUp />}
                />
                <Route
                    path="/me"
                    element={
                        authUser ? <ProfilePage /> : <Navigate to={"/login"} />
                    }
                />
                <Route
                    path="/user/:username"
                    element={
                        authUser ? (
                            <UserProfilePage />
                        ) : (
                            <Navigate to={"/login"} />
                        )
                    }
                />
                <Route
                    path="/group/:groupId"
                    element={
                        authUser ? <GroupInfo /> : <Navigate to={"/login"} />
                    }
                />
            </Routes>
        </Box>
    );
}

export default App;
