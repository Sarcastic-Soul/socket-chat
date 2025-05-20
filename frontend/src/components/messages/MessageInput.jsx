import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

	const handleEmojiClick = (emojiObject) => {
		setMessage((prevMessage) => prevMessage + emojiObject.emoji);
		setShowEmojiPicker(false);
	};

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 pr-16 bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<div className="absolute right-0 top-0 h-full flex items-center">
					<button
						type='button'
						className='h-full px-3 text-gray-400 hover:text-white'
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					>
						<BsEmojiSmile />
					</button>
					<button type='submit' className='h-full px-3 text-gray-400 hover:text-white'>
						{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
					</button>
				</div>

				{showEmojiPicker && (
					<div className="absolute bottom-12 right-0 z-10 shadow-lg">
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}
			</div>
		</form>
	);
};

export default MessageInput;
