import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { useState } from "react";
import toast from "react-hot-toast";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation, updateMessage } = useConversation();

    const senderId = message.senderId._id || message.senderId;
    const fromMe = senderId === authUser._id;

    const formattedTime = extractTime(message.createdAt);
    const shakeClass = message.shouldShake ? "shake" : "";

    let profilePic;
    if (fromMe) {
        profilePic = authUser.profilePic;
    } else {
        if (selectedConversation?.isGroupChat) {
            const sender = selectedConversation.participants.find(p => p._id === senderId);
            profilePic = sender?.profilePic;
        } else {
            profilePic = selectedConversation?.profilePic;
        }
    }

    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [isReacting, setIsReacting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [animatingReaction, setAnimatingReaction] = useState(null);

    const hasUserReactedWith = (reactionEmoji) => {
        return message.reactions?.some(
            (r) => r.userId === authUser._id && r.reaction === reactionEmoji
        );
    };

    const handleReaction = async (reaction) => {
        if (isReacting) return;

        setIsReacting(true);
        setAnimatingReaction(reaction);

        try {
            const res = await fetch(`/api/messages/react/${message._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reaction }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const updatedMessage = await res.json();
            if (updatedMessage.error) {
                throw new Error(updatedMessage.error);
            }

            updateMessage(updatedMessage);
            const reactionExistsAfterUpdate = updatedMessage.reactions.some(
                (r) => r.userId === authUser._id && r.reaction === reaction
            );
            if (reactionExistsAfterUpdate) {
                toast.success("Reaction added!");
            } else {
                toast.success("Reaction removed!");
            }

        } catch (error) {
            console.error("Error adding/removing reaction:", error.message);
            toast.error("Failed to update reaction.");
        } finally {
            setIsReacting(false);
            setShowReactionPicker(false);
            setTimeout(() => setAnimatingReaction(null), 500);
        }
    };

    const reactionCounts = message.reactions?.reduce((acc, current) => {
        acc[current.reaction] = (acc[current.reaction] || 0) + 1;
        return acc;
    }, {});

    const hasReactions = reactionCounts && Object.keys(reactionCounts).length > 0;
    const hasMedia = message.mediaUrl && message.mediaType !== "text";
    const showTextMessage = message.message && message.message.trim() !== "";

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
                <div className="relative">
                    <div
                        className={`relative px-4 py-2 rounded-2xl text-sm text-white ${shakeClass} ${fromMe ? "bg-blue-500 rounded-br-none" : "bg-gray-700 rounded-bl-none"}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setShowReactionPicker(false)}
                    >
                        {hasMedia && (
                            <div className="mb-2 max-w-full">
                                {message.mediaType === "image" && (
                                    <img src={message.mediaUrl} alt="Sent Media" className="rounded-md max-w-full h-auto object-contain" />
                                )}
                                {message.mediaType === "video" && (
                                    <video src={message.mediaUrl} controls className="rounded-md max-w-full h-auto"></video>
                                )}
                            </div>
                        )}
                        {showTextMessage && (
                            <p className={`${hasMedia ? "mt-2" : ""}`}>
                                {message.message}
                            </p>
                        )}
                        {!showTextMessage && !hasMedia && (
                            <p className="text-gray-400 italic">Empty message</p>
                        )}
                        {isHovered && (
                            <button
                                className={`absolute top-2 ${fromMe ? "-left-8" : "-right-8"} transform -translate-y-2 p-1 transition-all duration-200 hover:scale-110 z-10`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReactionPicker(!showReactionPicker);
                                }}
                                title="Add reaction"
                            >
                                <span className="text-lg">😊</span>
                            </button>
                        )}
                        {showReactionPicker && (
                            <div className={`absolute ${fromMe ? "right-0" : "left-0"} bottom-full mb-2 flex bg-white p-2 rounded-lg shadow-lg z-50 animate-bounce-in`}>
                                {["👍", "❤️", "😂", "😢", "😡"].map((reaction) => (
                                    <button
                                        key={reaction}
                                        className={`text-xl p-1 hover:bg-gray-200 rounded transition-all duration-200 hover:scale-125 ${isReacting ? "opacity-50 cursor-not-allowed" : ""} ${hasUserReactedWith(reaction) ? "bg-gray-300" : ""}`}
                                        onClick={() => !isReacting && handleReaction(reaction)}
                                        disabled={isReacting}
                                    >
                                        {reaction}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {hasReactions && (
                        <div className={`flex gap-1 mt-2 ${fromMe ? "justify-end" : "justify-start"}`}>
                            {Object.entries(reactionCounts).map(([reaction, count]) => (
                                <button
                                    key={reaction}
                                    className={`inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium shadow-sm border transition-all duration-300 ${animatingReaction === reaction ? "animate-bounce-reaction" : ""} ${hasUserReactedWith(reaction) ? "border-blue-500 bg-blue-100" : ""} hover:scale-105 cursor-pointer`}
                                    onClick={() => handleReaction(reaction)}
                                >
                                    <span className="text-sm">{reaction}</span>
                                    <span className="text-xs font-semibold">{count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <div
                        className={`text-xs text-gray-400 mt-1 ${fromMe ? "text-right" : "text-left"}`}
                    >
                        {formattedTime}
                    </div>
                </div>
                {fromMe && (
                    <img
                        src={authUser.profilePic}
                        alt="me"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                )}
            </div>
        </div>
    );
};

export default Message;
