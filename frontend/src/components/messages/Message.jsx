import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;

    const shakeClass = message.shouldShake ? "shake" : "";

    return (
        <div className={`flex ${fromMe ? "justify-end" : "justify-start"} mb-3`}>
            <div className="flex items-end gap-2 max-w-[80%]">
                {!fromMe && (
                    <img
                        src={profilePic}
                        alt="user"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                )}

                <div>
                    <div
                        className={`px-4 py-2 rounded-2xl text-sm  text-white ${shakeClass} ${fromMe
                            ? "bg-blue-500 rounded-br-none"
                            : "bg-gray-700 rounded-bl-none"
                            }`}
                    >
                        {message.message}
                    </div>
                    <div
                        className={`text-xs text-gray-400 mt-1 ${fromMe ? "text-right" : "text-left"
                            }`}
                    >
                        {formattedTime}
                    </div>
                </div>

                {fromMe && (
                    <img
                        src={profilePic}
                        alt="me"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                )}
            </div>
        </div>
    );
};
export default Message;
