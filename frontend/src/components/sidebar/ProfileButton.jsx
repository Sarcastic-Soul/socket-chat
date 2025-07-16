// ProfileButton.jsx
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const ProfileButton = () => {
    const navigate = useNavigate();
    const { authUser } = useAuthContext();

    const handleClick = () => {
        navigate("/me");
    };

    return (
        <div>
            {authUser?.profilePic ? (
                <img
                    src={authUser.profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer object-cover"
                    onClick={handleClick}
                />
            ) : (
                <div
                    className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                    onClick={handleClick}
                >
                    <span className="text-white text-lg font-bold">
                        {authUser?.username ? authUser.username.charAt(0).toUpperCase() : 'U'}
                    </span>
                </div>
            )}
        </div>
    );
};
export default ProfileButton;
