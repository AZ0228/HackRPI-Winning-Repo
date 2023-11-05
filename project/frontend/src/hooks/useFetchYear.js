import { useState, useEffect } from 'react';

export const useFetchYear = (value) => {
    const query = 'Year'
    const [yearEmissions, setData] = useState(null);
    const [yearLoading, setLoading] = useState(false);
    const [yearError, setError] = useState(null);
    
    useEffect(() => {
        if (value === null || value === undefined || value === '') {
            return;
        }

        setLoading(true);

        const encodedQuery = encodeURIComponent(query);
        const encodedValue = encodeURIComponent(value);
        const endpoint = `/capita/${encodedQuery}/${encodedValue}`;

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
                const emissionsData = {};
                for (let i = 0; i < jsonData.length; i++) {
                    const currentItem = jsonData[i];
                    emissionsData[currentItem['Entity']] = currentItem['Emissions'];
                }
                console.log(emissionsData);
                setData(emissionsData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query, value]);

    return { yearEmissions, yearLoading, yearError };
};