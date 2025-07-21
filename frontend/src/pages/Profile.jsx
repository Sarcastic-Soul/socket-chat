import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FaCamera } from "react-icons/fa";
import { useAuthContext } from '../context/AuthContext';

const ProfilePage = () => {
    const { authUser, setAuthUser } = useAuthContext();

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleEditClick = () => {
        fileInputRef.current.click();
    };

    const handleUploadAndSave = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first.");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading image...");

        try {
            const signatureRes = await fetch('/api/cloudinary/signature/profile-pic');
            const signatureData = await signatureRes.json();
            if (!signatureRes.ok) throw new Error(signatureData.error || "Failed to get upload signature.");
            const { signature, timestamp, cloudName, apiKey, folder } = signatureData;

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('api_key', apiKey);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('folder', folder);
            const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            const uploadRes = await fetch(url, { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error.message || "Cloudinary upload failed.");

            toast.loading("Updating profile...", { id: toastId });

            const dbUpdateRes = await fetch('/api/users/update-pic', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profilePic: uploadData.secure_url }),
            });
            const updatedUser = await dbUpdateRes.json();
            if (!dbUpdateRes.ok) throw new Error(updatedUser.error || "Failed to update profile.");

            // Update the global state. This will re-render all components using the context.
            setAuthUser(updatedUser);

            setSelectedFile(null);
            setPreviewUrl(null);
            toast.success("Profile updated successfully!", { id: toastId });

        } catch (err) {
            console.error("Upload failed:", err);
            toast.error(err.message || "An error occurred.", { id: toastId });
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    if (!authUser) {
        return <div className="flex justify-center items-center h-screen"><span className='loading loading-spinner loading-lg'></span></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

                <div className="relative w-32 h-32 mx-auto mb-4 group">
                    <img
                        // Prioritize showing the preview, then the authUser pic, then a placeholder
                        src={previewUrl || authUser.profilePic || `https://placehold.co/150x150/64748b/FFFFFF?text=${authUser.fullName.charAt(0)}`}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-blue-500"
                    />
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={handleEditClick}
                    >
                        <FaCamera className="text-white text-3xl" />
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                />

                {/* Show the save button only when a new file has been selected */}
                {selectedFile && (
                    <button
                        className="btn btn-primary w-full mb-6"
                        onClick={handleUploadAndSave}
                        disabled={isUploading}
                    >
                        {isUploading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                    </button>
                )}

                <div className="text-left space-y-3">
                    <p><strong>Full Name:</strong> {authUser.fullName}</p>
                    <p><strong>Username:</strong> {authUser.username}</p>
                    <p><strong>User ID:</strong> {authUser._id}</p>
                    <p><strong>Member Since:</strong> {new Date(authUser.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
