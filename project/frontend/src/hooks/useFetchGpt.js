import { useState, useEffect } from 'react';

export const useFetchGPT = (country) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const encodedCountry = encodeURIComponent(country);
    const endpoint = `/info/${encodedCountry}`;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError("Oops, we haven't got JSON!");
                }

                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return { data, loading, error };
};