import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { FaUsers } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();
    const navigate = useNavigate();

    useEffect(() => {
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    const isOnline = selectedConversation && !selectedConversation.isGroupChat
        ? onlineUsers.includes(selectedConversation.participantId)
        : false;

    const displayName = selectedConversation?.isGroupChat
        ? selectedConversation.groupName
        : selectedConversation?.fullName;

    const displayPic = selectedConversation?.profilePic || "/default-avatar.png";

    const handleHeaderClick = () => {
        if (selectedConversation?.isGroupChat) {
            navigate(`/group/${selectedConversation._id}`);
        } else if (selectedConversation) {
            navigate(`/user/${selectedConversation.participantId}`);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <div className="bg-white/10 backdrop-blur-lg px-4 py-3 mb-2 shadow-sm flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={handleHeaderClick}>
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img
                                    src={displayPic}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-semibold text-base md:text-lg">
                                    {displayName}
                                </span>
                                {!selectedConversation.isGroupChat && (
                                    <span className={`text-xs ${isOnline ? "text-green-400" : "text-gray-400"}`}>
                                        {isOnline ? "Online" : "Offline"}
                                    </span>
                                )}
                            </div>
                        </div>
                        {selectedConversation.isGroupChat && (
                            <button onClick={handleHeaderClick} className="p-2 text-white hover:bg-white/20 rounded-full">
                                <FaUsers className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
};

export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg md:text-xl text-white font-semibold flex flex-col items-center gap-2">
                <p>Welcome 👋 {authUser.fullName}</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className="text-3xl md:text-6xl text-center" />
            </div>
        </div>
    );
};
