import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const { setConversations } = useConversation();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/conversations`, {
					credentials: 'include',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}

				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (error) {
				console.error('Error fetching conversations:', error);
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, [setConversations]);

	return { loading };
};
export default useGetConversations;