import { UsePost } from '@/types';
import { usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';

const usePost = <TInput extends BodyInit | undefined, TOutput>(url: string): UsePost<TInput, TOutput> => {
    const [data, setData] = useState<TOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const csrf = usePage().props.csrf_token as string;

    const postData = useCallback(
        async (payload: TInput): Promise<TOutput> => {
            setError(null);
            setIsLoading(true);

            try {
                const res = await fetch(url, {
                    method: 'POST',
                    body: payload ? payload : undefined,
                    headers: {
                        'X-CSRF-TOKEN': csrf,
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `Bad request. Please try again.`);
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
