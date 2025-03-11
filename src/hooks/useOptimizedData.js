import { useState, useEffect } from 'react';

export const useOptimizedData = (fetchFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadData = async () => {
            try {
                setLoading(true);
                const result = await fetchFunction(controller.signal);
                setData(result);
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();

        return () => controller.abort();
    }, dependencies);

    return { data, loading, error };
}; 