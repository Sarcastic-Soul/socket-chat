// ProfilePage.jsx
import useGetUserDetails from '../hooks/useGetUserDetails';

const ProfilePage = () => {
    const { userDetails, loading, error } = useGetUserDetails();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><span className='loading loading-spinner loading-lg'></span></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    if (!userDetails) {
        return <div className="text-gray-500 text-center mt-10">No user data found.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
                {userDetails.profilePic && (
                    <img
                        src={userDetails.profilePic}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500"
                    />
                )}
                <div className="text-left space-y-3">
                    <p><strong>Full Name:</strong> {userDetails.fullName}</p>
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>User ID:</strong> {userDetails._id}</p>
                    <p><strong>Member Since:</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
