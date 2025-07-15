import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	const { messages, loading, loadOlderMessages, hasMore } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	return (
		<div className='px-4 py-2 flex-1 overflow-auto flex flex-col-reverse'>
			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

			{!loading && messages.length === 0 && (
				<p className='text-center text-gray-400'>Send a message to start the conversation</p>
			)}

			<div className='flex flex-col gap-1'>
				{messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}
			</div>

			{!loading && hasMore && messages.length > 0 && (
				<button
					className='self-center mb-3 text-sm text-blue-400 hover:underline'
					onClick={loadOlderMessages}
				>
					Load Older Messages
				</button>
			)}
		</div>
	);
};

export default Messages;
