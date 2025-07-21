import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetUsers from "../../hooks/useGetUsers";
import toast from "react-hot-toast";

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const { setSelectedConversation, conversations } = useConversation();
    const { users } = useGetUsers();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }

        const searchedUser = users.find((u) => u.fullName.toLowerCase().includes(search.toLowerCase()));

        console.log(conversations, searchedUser);
        if (searchedUser) {
            // Check if a conversation with this user already exists
            const conversation = conversations?.find(c => !c.isGroupChat && c.participantId === searchedUser._id);

            if (conversation) {
                // If it exists, just select it
                setSelectedConversation(conversation);
            } else {
                // If it doesn't exist, create a new local conversation object to start the chat
                // The conversation will be persisted in the DB when the first message is sent
                setSelectedConversation({
                    _id: searchedUser._id,
                    isGroupChat: false,
                    fullName: searchedUser.fullName,
                    profilePic: searchedUser.profilePic,
                    participantId: searchedUser._id,
                });
            }
            setSearch("");
        } else {
            toast.error("No such user found!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
            <input
                type="text"
                placeholder="Search to start a chat…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow min-w-0 px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
                type="submit"
                className="p-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition focus:outline-none"
            >
                <IoSearchSharp className="w-5 h-5" />
            </button>
        </form>
    );
};

export default SearchInput;
