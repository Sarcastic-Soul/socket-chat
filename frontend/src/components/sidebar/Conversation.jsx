import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    const isSelected = selectedConversation?._id === conversation._id;
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);

    return (
        <>
            <div
                className={`flex gap-2 items-center rounded p-2 py-1 cursor-pointer
    				hover:bg-white/10 transition
    				${isSelected ? "bg-white/20 backdrop-blur-md border border-white/30" : ""}`}
                onClick={() => setSelectedConversation(conversation)}
            >

                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <img src={conversation.profilePic} alt='user avatar' className='w-12 rounded-full' />
                </div>

                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between'>
                        <p className='font-bold text-gray-200'>{conversation.fullName}</p>
                    </div>
                </div>
            </div>

            {!lastIdx && (
                    <hr className="flex-grow border-t border-gray-500 my-2" />
            )}
        </>
    );
};
export default Conversation;
