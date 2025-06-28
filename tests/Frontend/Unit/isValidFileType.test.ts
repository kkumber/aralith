import { describe, expect, it } from 'vitest';
import {isValidFileType} from '../../../resources/js/lib/utils';
import {defaultAcceptedTypes} from '../../../resources/js/pages/quiz/config/config';

describe('Is valid file type', () => {
    it('return false for invalid file type', () => {
        const fn = isValidFileType( new File(['Hello World'], 'hello.exe', { type: 'application/x-msdownload' }), defaultAcceptedTypes);
        expect(fn).toBe(false);
    });

    it('return true for valid file type', () => {
        const fn = isValidFileType( new File(['Hello World'], 'hello.pdf', { type: 'application/pdf' }), defaultAcceptedTypes);
        expect(fn).toBe(true);
    });
})