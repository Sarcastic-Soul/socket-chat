import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileButton from "./ProfileButton";
import CreateGroupModal from "./CreateGroupModal";
import StartChatModal from "../modals/StartChatModal";
import { FaPlusCircle } from "react-icons/fa";

const Sidebar = () => {
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isStartChatModalOpen, setIsStartChatModalOpen] = useState(false);

    return (
        <div className="w-full h-full p-4 flex flex-col bg-white/10 backdrop-blur-xl backdrop-saturate-150">
            <SearchInput />
            <div className="divider px-3"></div>
            <Conversations />

            <div className='mt-auto flex items-center justify-between'>
                <div className="flex items-center gap-4">
                    <LogoutButton />
                    <ProfileButton />
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setIsStartChatModalOpen(true)} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors" title="Start New Chat">
                        <FaPlusCircle size={22} />
                    </button>
                    <button
                        onClick={() => setIsGroupModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors"
                    >
                        New Group
                    </button>
                </div>
            </div>

            {isGroupModalOpen && <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} />}
            {isStartChatModalOpen && <StartChatModal onClose={() => setIsStartChatModalOpen(false)} />}
        </div>
    );
};
export default Sidebar;
