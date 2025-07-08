import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import DragAndDrop from '../../../../resources/js/components/DragAndDrop/DragAndDrop';
import { createFile } from '../../utils/createFile';

describe('File validation', () => {
    const emptyFn = () => {};
    let mockFiles: File[] = [];

    beforeEach(() => {
        mockFiles = [new File(['Hello World'], 'hello.png', { type: 'image/png' })];
    });

    it('shows error for the maximum allowed files is reached', async () => {
        const user = userEvent.setup();
        render(<DragAndDrop maxFiles={5} files={mockFiles} setFiles={emptyFn} handleFilesSubmit={emptyFn} />);

        const fileInput = screen.getByLabelText(/upload files/i);
        const excessFiles: File[] = [];

        for (let i = 1; i <= 6; i++) {
            excessFiles.push(createFile(`file${i}.pdf`));
        }

        await user.upload(fileInput, excessFiles);
        expect(await screen.findByText(/maximum of 5 files per upload allowed/i)).toBeInTheDocument();
    });

    it('shows error for unsupported file type', async () => {
        const user = userEvent.setup();

        render(<DragAndDrop files={mockFiles} setFiles={emptyFn} handleFilesSubmit={emptyFn} />);

        const fileInput = screen.getByLabelText(/upload files/i);
        const invalidFile: File[] = [];
        invalidFile.push(createFile('virus.exe', 5, 'application/x-msdownload'));

        fireEvent.change(fileInput, { target: { files: invalidFile } });

        const errorMsg = screen.queryByRole('alert', { name: 'file error' });
        expect(errorMsg).not.toBeInTheDocument();
        expect(await screen.findByText(/unsupported file/i)).toBeInTheDocument();
    });

    it('shows error for exceeding the maximum file size', async () => {
        const user = userEvent.setup();
        render(<DragAndDrop files={mockFiles} setFiles={emptyFn} handleFilesSubmit={emptyFn} />);
        const fileInput = screen.getByLabelText(/upload files/i);
        const largeFile: File[] = [];
        largeFile.push(createFile('file.pdf', 11));

        await user.upload(fileInput, largeFile);

        const errorMsg = screen.queryByRole('alert', { name: 'file error' });
        expect(errorMsg).not.toBeInTheDocument();
        expect(await screen.findByText(/exceeds.*mb/i)).toBeInTheDocument();
    });

    it('shows error for an already existing file', async () => {
        const user = userEvent.setup();

        render(<DragAndDrop files={mockFiles} setFiles={emptyFn} handleFilesSubmit={emptyFn} />);
        const fileInput = screen.getByLabelText(/upload files/i);
        const existingFile = [new File(['a'.repeat(5 * 1024 * 1024)], 'existingFile.pdf', { type: 'application/pdf' })];

        await user.upload(fileInput, existingFile);
        await user.upload(fileInput, existingFile);

        const errorMsg = screen.queryByRole('alert', { name: 'file error' });
        expect(errorMsg).not.toBeInTheDocument();
        expect(await screen.findByText(/file.*already exists/i)).toBeInTheDocument();
    });

    it('shows no error if file passed all validation', async () => {
        const user = userEvent.setup();

        render(<DragAndDrop files={mockFiles} setFiles={emptyFn} handleFilesSubmit={emptyFn} />);
        const fileInput = screen.getByLabelText(/upload files/i);
        const validFile: File[] = [];

        for (let i = 0; i <= 5; i++) {
            validFile.push(createFile(`file${i}`));
        }

        await user.upload(fileInput, validFile);

        const errorMsg = screen.queryByRole('alert', { name: 'file error' });
        expect(errorMsg).not.toBeInTheDocument();
    });
});
