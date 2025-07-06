import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import usePost from '../../../resources/js/hooks/usePost';

describe('usePost', () => {
    const url = 'http:localhost/api/test';
    const payload = JSON.stringify({ name: 'Test' });
    const mockResponse = { message: 'success' };

    beforeEach(() => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            }),
        ) as unknown as typeof fetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return data on successful post', async () => {
        const { result } = renderHook(() => usePost<typeof payload, typeof mockResponse>(url));

        await act(async () => {
            const data = await result.current.postData(payload);
            expect(data).toEqual(mockResponse);
        });

        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('should return error on failed post', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Something went wrong' }),
            }),
        ) as unknown as typeof fetch;

        const { result } = renderHook(() => usePost<typeof payload, typeof mockResponse>(url));

        await act(async () => {
            await expect(result.current.postData(payload)).rejects.toThrow('Something went wrong');
        });

        expect(result.current.data).toBeNull();
        expect(result.current.error).toEqual('Something went wrong');
        expect(result.current.isLoading).toBe(false);
    });
});
