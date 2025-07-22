import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { clearAllMessages } from "../utils/messageCacheDB";

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        setLoading(true);
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            try {
                await Promise.race([
                    clearAllMessages(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('IndexedDB clear timeout')), 5000)
                    )
                ]);
            } catch (dbError) {
                console.warn('Failed to clear IndexedDB, trying alternative method:', dbError);
            }

            localStorage.removeItem("chat-user");
            setAuthUser(null);

        } catch (error) {
            toast.error(error.message);
            localStorage.removeItem("chat-user");
            setAuthUser(null);
        } finally {
            setLoading(false);
        }
    };

    return { loading, logout };
};
export default useLogout;
