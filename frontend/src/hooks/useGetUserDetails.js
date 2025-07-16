// hooks/useGetUserDetails.js
import { useEffect, useState } from 'react';
import {useAuthContext} from '../context/AuthContext';

const useGetUserDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authUser } = useAuthContext(); // Get the logged-in user ID

    useEffect(() => {
        const getUserDetails = async () => {
            if (!authUser || !authUser._id) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/users/${authUser._id}`); // API endpoint to fetch user details by ID
                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }
                setUserDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getUserDetails();
    }, [authUser]); // Re-fetch if authUser changes

    return { userDetails, loading, error };
};

export default useGetUserDetails;
