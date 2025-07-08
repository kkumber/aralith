import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DragAndDrop from '../../../../resources/js/components/DragAndDrop/DragAndDrop';

let mockFiles: File[] = [];
const mockFn = vi.fn();

describe('File selection and drag and drop', () => {
    const emptyFn = () => {};

    beforeEach(() => {
        mockFiles = [
            new File(['Hello World'], 'hello.png', { type: 'image/png' }),
            new File(['Another file content'], 'notes.pdf', { type: 'application/pdf' }),
        ];
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('saves the dragged and dropped files', () => {
        render(<DragAndDrop files={mockFiles} setFiles={mockFn} handleFilesSubmit={emptyFn} />);

        const dropZone = screen.getByRole('region', { name: 'file dropzone' });

        fireEvent.dragOver(dropZone, {
            dataTransfer: {
                files: mockFiles,
                types: ['Files'],
            },
        });

        fireEvent.drop(dropZone, {
            dataTransfer: {
                files: mockFiles,
                types: ['Files'],
            },
        });

        expect(mockFn).toHaveBeenCalled();
    });

    it('saves the selected files via user input', async () => {
        const user = userEvent.setup();
        render(<DragAndDrop files={mockFiles} setFiles={mockFn} handleFilesSubmit={emptyFn} />);
        const input = screen.getByLabelText(/upload/i);
        await user.upload(input, mockFiles);

        expect(mockFn).toHaveBeenCalled();
    });
});
