import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { FaArrowLeft, FaEdit, FaTrash, FaUserPlus, FaCrown, FaUserMinus, FaCamera } from "react-icons/fa";
import AddMemberModal from '../components/modals/AddMemberModal';

const GroupInfo = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuthContext();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    // State for image upload
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchGroupDetails = async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/groups/${groupId}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setGroup(data);
            setGroupName(data.groupName);
        } catch (error) {
            toast.error(error.message);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId, navigate]);

    const handleApiResponse = async (apiCall, successMessage) => {
        try {
            const res = await apiCall();
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            await fetchGroupDetails();
            toast.success(successMessage);
            return data;
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            handleIconUpload(file);
        }
    };

    const handleIconUpload = async (file) => {
        setIsUploading(true);
        const toastId = toast.loading("Uploading icon...");
        try {
            const signatureRes = await fetch('/api/cloudinary/signature/group-icon');
            const signatureData = await signatureRes.json();
            if (!signatureRes.ok) throw new Error(signatureData.error || "Failed to get upload signature.");

            const { signature, timestamp, cloudName, apiKey, folder } = signatureData;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('folder', folder);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error.message || "Cloudinary upload failed.");

            await handleApiResponse(
                () => fetch(`/api/groups/${groupId}/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ groupIcon: uploadData.secure_url }),
                }),
                "Group icon updated!"
            );

            setPreviewUrl(null);
            toast.dismiss(toastId);
        } catch (err) {
            toast.error(err.message || "Upload failed.", { id: toastId });
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    // ... [other handler functions: handleNameChange, handleRemoveMember, etc.] ...
    const handleNameChange = async () => {
        if (groupName === group.groupName) {
            setIsEditingName(false);
            return;
        }
        await handleApiResponse(
            () => fetch(`/api/groups/${groupId}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupName }),
            }),
            "Group name updated!"
        );
        setIsEditingName(false);
    };

    const handleRemoveMember = async (userIdToRemove) => {
        if (userIdToRemove === authUser._id && group.admins.length === 1 && group.participants.length > 1) {
            return toast.error("You are the last admin. Make someone else an admin before leaving.");
        }
        await handleApiResponse(
            () => fetch(`/api/groups/${groupId}/participants/remove`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIdToRemove }),
            }),
            "Member removed!"
        );
    };

    const handleMakeAdmin = async (userIdToMakeAdmin) => {
        await handleApiResponse(
            () => fetch(`/api/groups/${groupId}/admins/add`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIdToMakeAdmin }),
            }),
            "New admin promoted!"
        );
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;
        try {
            await fetch(`/api/groups/${groupId}/delete`, {
                method: 'DELETE'
            });
            toast.success("Group deleted!");
            navigate("/");
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading || !group) {
        return <div className="flex justify-center items-center h-screen"><span className='loading loading-spinner loading-lg'></span></div>;
    }

    const isAdmin = group.admins.some(admin => admin._id === authUser._id);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
            <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-lg relative">
                <button onClick={() => navigate("/")} className="absolute top-5 left-5 p-2 rounded-full hover:bg-white/10 transition-colors">
                    <FaArrowLeft size={20} />
                </button>
                {isAdmin && (
                    <div className="absolute top-5 right-5 flex gap-3">
                        <button onClick={() => setIsAddMemberModalOpen(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Add Member">
                            <FaUserPlus size={20} />
                        </button>
                        <button onClick={handleDeleteGroup} className="p-2 rounded-full text-red-500 hover:bg-red-500/20 transition-colors" title="Delete Group">
                            <FaTrash size={20} />
                        </button>
                    </div>
                )}

                <div className="flex flex-col items-center text-center pt-8 mb-8">
                    <div className="relative w-32 h-32 mb-4 group">
                        <img
                            src={previewUrl || group.groupIcon || `https://ui-avatars.com/api/?name=${group.groupName}&background=random&bold=true`}
                            alt={group.groupName}
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                        />
                        {isAdmin && (
                            <div
                                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => !isUploading && fileInputRef.current.click()}
                            >
                                {isUploading ? <span className="loading loading-spinner"></span> : <FaCamera className="text-white text-3xl" />}
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                        disabled={isUploading}
                    />
                    <div className="flex flex-col items-center gap-2 mt-2">
                        {isEditingName ? (
                            <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} onBlur={handleNameChange} onKeyDown={(e) => e.key === 'Enter' && handleNameChange()} className="text-3xl font-bold bg-gray-700/50 text-center rounded-md p-1" autoFocus />
                        ) : (
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                {group.groupName}
                                {isAdmin && <FaEdit onClick={() => setIsEditingName(true)} className="cursor-pointer text-xl text-gray-400 hover:text-white transition-colors" />}
                            </h1>
                        )}
                        <p className="text-gray-400">{group.participants.length} members</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Members</h3>
                <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                    {group.participants.map(p => {
                        const isParticipantAdmin = group.admins.some(admin => admin._id === p._id);
                        return (
                            <div key={p._id} className="flex items-center p-3 rounded-lg hover:bg-gray-700/50 group transition-colors">
                                <img src={p.profilePic} alt={p.fullName} className="w-12 h-12 rounded-full mr-4" />
                                <span className="flex-grow text-lg font-medium">{p.fullName}</span>
                                {isParticipantAdmin && (
                                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full mr-4 font-semibold">Admin</span>
                                )}
                                {isAdmin && p._id !== authUser._id && (
                                    <div className="hidden group-hover:flex items-center gap-2">
                                        {!isParticipantAdmin && (
                                            <button onClick={() => handleMakeAdmin(p._id)} className="p-2 text-green-400 hover:bg-white/10 rounded-full transition-colors" title="Make Admin">
                                                <FaCrown />
                                            </button>
                                        )}
                                        <button onClick={() => handleRemoveMember(p._id)} className="p-2 text-red-500 hover:bg-white/10 rounded-full transition-colors" title="Remove Member">
                                            <FaUserMinus />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {isAddMemberModalOpen && <AddMemberModal group={group} onClose={() => setIsAddMemberModalOpen(false)} onMemberAdded={fetchGroupDetails} />}
        </div>
    );
};

export default GroupInfo;
