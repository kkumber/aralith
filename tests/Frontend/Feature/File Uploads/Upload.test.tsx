import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DragnDrop from '../../../../resources/js/components/DragAndDrop/DragNdrop';

describe('File upload', () => {
    let files: File[];

    beforeEach(() => {
        files = [
            new File(['Hello World'], 'hello.png', { type: 'image/png' }),
            new File(['Another file content'], 'notes.pdf', { type: 'application/pdf' }),
        ];
    });

    it('show file list when a file is dropped', async () => {
        const mockAddFile = vi.fn();
        const emptyFn = () => {};
        render(<DragnDrop onFilesSelected={mockAddFile} handleFilesSubmit={emptyFn} />);

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
        expect(mockAddFile).toHaveBeenCalledWith(files);

        // Must await findByText since the UI appears after a state change
        const fileList = await screen.findByText(/selected files/i);
        expect(fileList).toBeInTheDocument();
    });
});
