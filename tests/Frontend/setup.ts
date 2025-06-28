import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

expect.extend(matchers);

(globalThis as any).route = vi.fn((name: string) => `/${name}`);

afterEach(() => {
    cleanup();
});
