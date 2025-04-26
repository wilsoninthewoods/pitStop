import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Custom React hook to fetch restroom data from the backend API.
 *
 * @function useRestrooms
 * @returns {{
 *  restroom: Array<Object>,
 *  loading: boolean,
 *  error: string|null
 * }}
 */
export function useRestrooms() {
    const [restroom, setRestrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestrooms = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/restrooms');
                setRestrooms(response.data);
            } catch (err) {
                console.error('Error fetching restrooms:', err);
                setError(err.message || 'Failed to fetch restrooms.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestrooms();
    }, []);

    return { restroom, loading, error };
}
