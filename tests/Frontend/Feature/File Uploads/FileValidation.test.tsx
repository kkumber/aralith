import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DragAndDrop from '../../../../resources/js/components/DragAndDrop/DragAndDrop';

describe('File validation', () => {
    it('shows error when the maximum allowed files is reached', async () => {
        const user = userEvent.setup();
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

        await user.upload(fileInput, excessFiles);

        expect(await screen.findByText(/maximum of 5 files per upload allowed/i)).toBeInTheDocument();
        screen.debug();
    });
});
