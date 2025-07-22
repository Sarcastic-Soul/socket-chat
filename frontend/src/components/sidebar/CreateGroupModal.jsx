import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CreateGroupModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setAllUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = allUsers.filter(user =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, allUsers]);

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedUsers.length === 0) {
            toast.error("Please provide a group name and select at least one member.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/groups/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: groupName,
                    participants: selectedUsers,
                }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            toast.success("Group created successfully!");
            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl text-white mb-4">Create Group Chat</h2>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
                />
                <input
                    type="text"
                    placeholder="Search for users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
                />
                <div className="max-h-60 overflow-y-auto mb-4">
                    {loading ? <span className="loading loading-spinner"></span> :
                        filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleUserSelection(user._id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user._id)}
                                    readOnly
                                    className="mr-3"
                                />
                                <img
                                    src={user.profilePic}
                                    alt={user.fullName}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <span className="text-white">{user.fullName}</span>
                            </div>
                        ))}
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
