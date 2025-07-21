import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full h-full p-4 flex flex-col bg-white/10 backdrop-blur-xl backdrop-saturate-150">
            <SearchInput />
            <div className="divider px-3"></div>
            <Conversations />
            <div className='mt-auto flex items-center justify-between'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Create Group
                </button>
                <LogoutButton />
                <ProfileButton />
            </div>
            {isModalOpen && <CreateGroupModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};
export default Sidebar;
