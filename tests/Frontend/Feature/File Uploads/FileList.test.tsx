import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

    it('renders list of files', async () => {
        render(<FileList files={files} handleFilesSubmit={mockFn} handleClearAllFiles={emptyFn} handleRemoveFile={emptyFn} />);
        const fileList = await screen.findByText(/selected files/i);
        expect(fileList).toBeInTheDocument();

        // Also verify the UI shows the correct files
        expect(screen.getByText('hello.png')).toBeInTheDocument();
        expect(screen.getByText('notes.pdf')).toBeInTheDocument();
    });

    it('calls handleRemoveFile when remove button is clicked', () => {
        render(<FileList files={files} handleFilesSubmit={emptyFn} handleClearAllFiles={emptyFn} handleRemoveFile={mockFn} />);
        const file = screen.getByText('hello.png');
        const removeBtn = screen.getByLabelText('Remove hello.png');

        fireEvent.click(removeBtn);

        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('removes all selected files when clear all is clicked', () => {
        const DragAndDrop = () => {
            const [mockFiles, setMockFiles] = useState(files);
            const mockClearFiles = () => {
                mockFn();
                setMockFiles([]);
            };
            return <FileList files={mockFiles} handleClearAllFiles={mockClearFiles} handleRemoveFile={emptyFn} handleFilesSubmit={emptyFn} />;
        };
        render(<DragAndDrop />);
        const clearBtn = screen.getByRole('button', { name: 'Clear All' });

        fireEvent.click(clearBtn);

        expect(mockFn).toHaveBeenCalled();
        files.forEach((file) => {
            expect(screen.queryByText(file.name)).not.toBeInTheDocument();
        });
    });

    it('submits the files in the list', () => {
        render(<FileList files={files} handleFilesSubmit={mockFn} handleClearAllFiles={emptyFn} handleRemoveFile={emptyFn} />);

        const submitBtn = screen.getByRole('button', { name: /extract lessons/i });

        fireEvent.click(submitBtn);

        expect(mockFn).toHaveBeenCalled();
    });
});
