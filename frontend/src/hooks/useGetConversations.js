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
				const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/conversations`);
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (error) {
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
