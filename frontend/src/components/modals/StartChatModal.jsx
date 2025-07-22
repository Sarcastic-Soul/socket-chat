import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useConversation from '../../zustand/useConversation';

const StartChatModal = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { setSelectedConversation } = useConversation();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users/new");
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setUsers(data);
            } catch (error) {
                toast.error("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSelectUser = (user) => {
        setSelectedConversation({
            _id: user._id,
            isGroupChat: false,
            fullName: user.fullName,
            profilePic: user.profilePic,
            participantId: user._id,
        });
        onClose();
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-4">Start a New Chat</h2>
                <input
                    type="text"
                    placeholder="Search for someone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
                />
                <div className="max-h-96 overflow-y-auto space-y-2">
                    {loading ? <span className='loading loading-spinner mx-auto'></span> :
                        filteredUsers.map(user => (
                            <div key={user._id} onClick={() => handleSelectUser(user)} className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer transition-colors">
                                <img src={user.profilePic} alt={user.fullName} className="w-12 h-12 rounded-full mr-4" />
                                <span className="font-medium">{user.fullName}</span>
                            </div>
                        ))
                    }
                    {!loading && filteredUsers.length === 0 && (
                        <p className="text-center text-gray-400 py-4">No users found.</p>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartChatModal;
