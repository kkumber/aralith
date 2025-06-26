import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DragAndDrop from '../../../../resources/js/components/DragAndDrop/DragAndDrop';

describe('File validation', () => {
    it('shows error when the maximum allowed files is reached', async () => {
        const emptyFn = () => {};
        render(<DragAndDrop onFilesSelected={emptyFn} handleFilesSubmit={emptyFn} maxFiles={5} />);

        const fileInput = screen.getByLabelText(/upload files/i);
        const excessFiles = [
            new File(['Hello World'], 'hello.png', { type: 'image/png' }),
            new File(['Hello World1'], 'hello1.png', { type: 'image/png' }),
            new File(['Hello World2'], 'hello2.png', { type: 'image/png' }),
            new File(['Hello World3'], 'hello3.png', { type: 'image/png' }),
            new File(['Hello World4'], 'hello4.png', { type: 'image/png' }),
            new File(['Hello World5'], 'hello5.png', { type: 'image/png' }),
        ];

        fireEvent.input(fileInput, { target: { files: excessFiles } });

        expect(await screen.findByText(/Maximum of 5 files per upload allowed/i)).toBeInTheDocument();
        screen.debug();
    });
});
