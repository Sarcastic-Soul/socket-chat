import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";

const SearchInput = () => {
    const { searchTerm, setSearchTerm } = useConversation();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <form className="flex items-center gap-2 w-full" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="Search conversations…"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <IoSearchSharp className="w-5 h-5 text-gray-400" />
                </div>
            </div>
        </form>
    );
};

export default SearchInput;
