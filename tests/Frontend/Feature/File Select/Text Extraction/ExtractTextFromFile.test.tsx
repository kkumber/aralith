import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FileList from '../../../../../resources/js/components/DragAndDrop/FileList';

let mockFiles: File[] = [];
const emptyFn = () => {};
const mockFn = vi.fn();

vi.mock('../../../../../resources/js/hooks/useFileProcessor.tsx', () => ({
    useFileProcessor: () => ({
        files: mockFiles,
        handleFilesSubmit: mockFn,
    }),
}));

describe('Extract text from files', () => {
    beforeEach(() => {
        mockFiles = [
            new File(['Hello World'], 'hello.png', { type: 'image/png' }),
            new File(['Another file content'], 'notes.pdf', { type: 'application/pdf' }),
        ];
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('file submission handler is called', async () => {
        const user = userEvent.setup();
        render(<FileList files={mockFiles} handleRemoveFile={emptyFn} handleClearAllFiles={emptyFn} />);

        const extractFiles = screen.getByRole('button', { name: /extract lessons/i });
        screen.debug();

        await user.click(extractFiles);

        expect(mockFn).toHaveBeenCalled();
    });
});
