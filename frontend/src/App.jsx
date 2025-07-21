import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import ProfilePage from "./pages/Profile";
import UserProfilePage from "./pages/UserProfile";
import GroupInfo from "./pages/GroupInfo";

function App() {
    const { authUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser === null) {
            navigate("/login");
        }
    }, [authUser, navigate]);

    return (
        <div className='p-4 h-screen flex items-center justify-center'>
            <Routes>
                <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
                <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
                <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
                <Route path='/me' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
                <Route path='/user/:userId' element={authUser ? <UserProfilePage /> : <Navigate to={"/login"} />} />
                <Route path='/group/:groupId' element={authUser ? <GroupInfo /> : <Navigate to={"/login"} />} />
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
