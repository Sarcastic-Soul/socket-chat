import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }

        const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

        if (conversation) {
            setSelectedConversation(conversation);
            setSearch("");
        } else toast.error("No such user found!");
    };
    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
            <input
                type="text"
                placeholder="Search…"
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
