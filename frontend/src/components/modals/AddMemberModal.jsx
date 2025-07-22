import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useGetUsers from '../../hooks/useGetUsers';

const AddMemberModal = ({ group, onClose, onMemberAdded }) => {
    const { users, loading } = useGetUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const availableUsers = users.filter(user => !group.participants.some(p => p._id === user._id));

        const results = availableUsers.filter(user =>
			user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredUsers(results);
    }, [searchTerm, users, group.participants]);

    const handleAddMember = async (userIdToAdd) => {
        try {
            const res = await fetch(`/api/groups/${group._id}/participants/add`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIdToAdd }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("Member added successfully!");
            onMemberAdded(data); // Callback to update the parent component's state
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-4">Add New Member</h2>
                <input
					type="text"
					placeholder="Search for users to add..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
				/>
                <div className="max-h-72 overflow-y-auto">
                    {loading ? <span className='loading loading-spinner'></span> :
                        filteredUsers.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700">
                                <div className="flex items-center">
                                    <img src={user.profilePic} alt={user.fullName} className="w-10 h-10 rounded-full mr-3" />
                                    <span>{user.fullName}</span>
                                </div>
                                <button onClick={() => handleAddMember(user._id)} className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600">
                                    Add
                                </button>
                            </div>
                        ))
                    }
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
