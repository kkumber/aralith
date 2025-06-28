import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DragAndDrop from '../../../../resources/js/components/DragAndDrop/DragAndDrop';

describe('File validation', () => {
    const emptyFn = () => {};

    it('shows error for the maximum allowed files is reached', async () => {
        const user = userEvent.setup();
        render(<DragAndDrop onFilesSelected={emptyFn} handleFilesSubmit={emptyFn} maxFiles={5} />);

        const fileInput = screen.getByLabelText(/upload files/i);
        const excessFiles = [
            new File(['1'], 'hello1.pdf', { type: 'application/pdf' }),
            new File(['2'], 'hello2.pdf', { type: 'application/pdf' }),
            new File(['3'], 'hello3.pdf', { type: 'application/pdf' }),
            new File(['4'], 'hello4.pdf', { type: 'application/pdf' }),
            new File(['5'], 'hello5.pdf', { type: 'application/pdf' }),
            new File(['6'], 'hello6.pdf', { type: 'application/pdf' }),
        ];

        await user.upload(fileInput, excessFiles);
        expect(await screen.findByText(/maximum of 5 files per upload allowed/i)).toBeInTheDocument();
    });

    it('shows error for unsupported file type', async () => {
        render(<DragAndDrop onFilesSelected={emptyFn} handleFilesSubmit={emptyFn} />);

        const fileInput = screen.getByLabelText(/upload files/i);
        const invalidFile = new File(['dummy'], 'file.exe', { type: 'application/x-msdownload' });

        fireEvent.change(fileInput, { target: { files: [invalidFile] } });
        expect(await screen.findByText(/unsupported/i)).toBeInTheDocument();
    });

    it('shows error for exceeding the maximum file size', async () => {
        render(<DragAndDrop onFilesSelected={emptyFn} handleFilesSubmit={emptyFn} />);
        const fileInput = screen.getByLabelText(/upload files/i);
        const largeFile = [new File(['a'.repeat(11 * 1024 * 1024)], 'largeFile.pdf', { type: 'application/pdf' })];

        fireEvent.change(fileInput, { target: { files: largeFile } });
        expect(await screen.findByText(/exceeds.*mb/i)).toBeInTheDocument();
    });

    it('shows error for an already existing file', async () => {
        const user = userEvent.setup();

        render(<DragAndDrop onFilesSelected={emptyFn} handleFilesSubmit={emptyFn} />);
        const fileInput = screen.getByLabelText(/upload files/i);
        const existingFile = [new File(['a'.repeat(5 * 1024 * 1024)], 'existingFile.pdf', { type: 'application/pdf' })];

        user.upload(fileInput, existingFile);
        user.upload(fileInput, existingFile);

        expect(await screen.findByText(/file.*already exists/i)).toBeInTheDocument();
    });

    it('shows no error if file passed all validation', async () => {
        const user = userEvent.setup();

        render(<DragAndDrop onFilesSelected={emptyFn} handleFilesSubmit={emptyFn} />);
        const fileInput = screen.getByLabelText(/upload files/i);
        const validFile = [
            new File(['1'.repeat(5 * 1024 * 1024)], 'hello1.pdf', { type: 'application/pdf' }),
            new File(['2'.repeat(5 * 1024 * 1024)], 'hello2.pdf', { type: 'application/pdf' }),
            new File(['3'.repeat(5 * 1024 * 1024)], 'hello3.pdf', { type: 'application/pdf' }),
            new File(['4'.repeat(5 * 1024 * 1024)], 'hello4.pdf', { type: 'application/pdf' }),
            new File(['5'.repeat(5 * 1024 * 1024)], 'hello5.pdf', { type: 'application/pdf' }),
        ];

        screen.debug();

        await user.upload(fileInput, validFile);

        const errorMsg = screen.queryByRole('alert', { name: 'file error' });

        expect(errorMsg).not.toBeInTheDocument();
        screen.debug();
    });
});
