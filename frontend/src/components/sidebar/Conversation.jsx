import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();

    const isSelected = selectedConversation?._id === conversation._id;

    // For 1-on-1 chats, check if the other user is online
    // For group chats, we don't show an online status for the group itself
    const isOnline = !conversation.isGroupChat && onlineUsers.includes(conversation._id);

    const displayName = conversation.isGroupChat ? conversation.groupName : conversation.fullName;
    const displayPic = conversation.profilePic;

    return (
        <>
            <div
                className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer transition
                    hover:bg-white/10 ${isSelected ? "bg-white/20 backdrop-blur-md border border-white/30" : ""}`}
                onClick={() => setSelectedConversation(conversation)}
            >
                {/* Profile Picture with Online Dot */}
                <div className="relative">
                    <img
                        src={displayPic}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
                    )}
                </div>

                {/* Name */}
                <div className="flex flex-col">
                    <p className="text-gray-200 font-medium">{displayName}</p>
                </div>
            </div>

            {!lastIdx && <hr className="border-t border-gray-600 my-2 mx-4" />}
        </>
    );
};

export default Conversation;
