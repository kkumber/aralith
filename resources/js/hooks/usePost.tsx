import { useCallback, useState } from 'react';

const usePost = (url: string) => {
    const [data, setData] = useState();
    const [error, setError] = useState<string | null>();
    const [isLoading, setIsLoading] = useState<boolean>();

    const postData = useCallback(
        async (payload: any) => {
            setError(null);
            setIsLoading(true);

            try {
                const res = await fetch(url, { method: 'POST', body: payload });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
                }
                const result = await res.json();
                setData(result);
                return result;
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : 'Unknown Error');
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [url],
    );

    return { postData, data, error, isLoading };
};

export default usePost;
