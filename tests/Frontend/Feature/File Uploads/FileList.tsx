import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DragnDrop from '../../../../resources/js/components/DragAndDrop/DragNdrop';
import FileList from '../../../../resources/js/components/DragAndDrop/FileList';

describe('File List', () => {
    let files: File[];
    const mockFn = vi.fn();
    const emptyFn = () => {};

    beforeEach(() => {
        files = [
            new File(['Hello World'], 'hello.png', { type: 'image/png' }),
            new File(['Another file content'], 'notes.pdf', { type: 'application/pdf' }),
        ];
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('show file list when a file is dropped or selected', async () => {
        render(<DragnDrop onFilesSelected={mockFn} handleFilesSubmit={emptyFn} />);

        const dropZone = screen.getByRole('region', { name: 'file dropzone' });

        fireEvent.dragOver(dropZone, {
            dataTransfer: {
                files: files,
                types: ['Files'],
            },
        });

        fireEvent.drop(dropZone, {
            dataTransfer: {
                files: files,
                types: ['Files'],
            },
        });
        expect(mockFn).toHaveBeenCalledWith(files);

        // Must await findByText since the UI appears after a state change
        const fileList = await screen.findByText(/selected files/i);
        expect(fileList).toBeInTheDocument();
    });

    it('submits the files in the list', () => {
        render(<FileList files={files} handleFilesSubmit={mockFn} handleClearAllFiles={emptyFn} handleRemoveFile={emptyFn} />);

        const submitBtn = screen.getByRole('button', { name: /extract lessons/i });

        fireEvent.click(submitBtn);

        expect(mockFn).toHaveBeenCalledWith(files);
    });
});
