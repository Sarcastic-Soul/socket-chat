import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import useConversation from "../../zustand/useConversation";

const Conversations = () => {
    const { loading } = useGetConversations();
    const { conversations, searchTerm } = useConversation();

    const filteredConversations = conversations.filter(conv => {
        const name = conv.isGroupChat ? conv.groupName : conv.fullName;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {filteredConversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    lastIdx={idx === filteredConversations.length - 1}
                />
            ))}

            {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
            {!loading && filteredConversations.length === 0 && (
                <p className="text-center text-gray-400 mt-4">No conversations found.</p>
            )}
        </div>
    );
};
export default Conversations;
