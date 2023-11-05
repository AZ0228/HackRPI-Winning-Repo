import { useState, useEffect } from 'react';

export const useFetchEmissions = (value) => {
    const query = 'Entity'
    const [countryEmissions, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (value === null || value === undefined || value === '') {
            return;
        }

        setLoading(true);

        const encodedQuery = encodeURIComponent(query);
        const encodedValue = encodeURIComponent(value);
        const endpoint = `/cumulative/${encodedQuery}/${encodedValue}`;

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
    }, [query, value]);

    return { countryEmissions, loading, error };
};