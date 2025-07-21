import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UserProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/users/${userId}`);
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setUser(data);
            } catch (error) {
                toast.error(error.message);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [userId, navigate]);

    if (loading || !user) {
        return <div className="flex justify-center items-center h-screen"><span className='loading loading-spinner loading-lg'></span></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg text-center relative">
                <h1 className="text-3xl font-bold mb-6">{user.fullName}'s Profile</h1>
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                        src={user.profilePic || `https://ui-avatars.com/api/?name=${user.fullName}&background=random&bold=true`}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-blue-500"
                    />
                </div>
                <div className="text-left space-y-3 mt-6">
                    <p><strong>Full Name:</strong> {user.fullName}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
