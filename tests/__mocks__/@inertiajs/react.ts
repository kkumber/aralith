import React from 'react';
import { vi } from 'vitest';

// Mock usePage hook
let mockPageProps = {};
export const setMockPageProps = (props) => (mockPageProps = props);

export const usePage = () => ({
    props: mockPageProps,
    url: '/mock-url',
});

// Mock Link component
export const Link = ({ href, children, method = 'get', as = 'a', ...props }) => {
    const tag = as === 'button' ? 'button' : 'a';
    return React.createElement(tag, { ...props, href }, children);
};

// Mock router
export const router = {
    get: vi.fn(),
    post: vi.fn(),
};
