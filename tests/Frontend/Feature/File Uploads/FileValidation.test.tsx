import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DragAndDrop from '../../../../resources/js/components/DragAndDrop/DragAndDrop';

describe('File validation', () => {
    const emptyFn = () => {};

    it('shows error when the maximum allowed files is reached', async () => {
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

    it('shows error when unsupported file type', async () => {
        render(<DragAndDrop onFilesSelected={emptyFn} handleFilesSubmit={emptyFn} maxFiles={5} />);

        const fileInput = screen.getByLabelText(/upload files/i);
        const invalidFile = new File(['dummy'], 'file.exe', { type: 'application/x-msdownload' });

        fireEvent.change(fileInput, { target: { files: [invalidFile] } });
        expect(await screen.findByText(/unsupported/i)).toBeInTheDocument();
    });
});
