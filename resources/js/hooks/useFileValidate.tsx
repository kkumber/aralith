import { useCallback, useState } from 'react';

const useFileValidate = (maxFileSize: number, acceptedTypes: string[], maxFiles: number, files: File[]) => {
    const [error, setError] = useState<string>('');

    const validateFile = useCallback(
        (file: File, currentNumFiles: number): boolean => {
            setError('');
            if (currentNumFiles > maxFiles) {
                setError(`Maximum of ${maxFiles} files allowed`);
                return false;
            }

            if (file.size > maxFileSize * 1024 * 1024) {
                setError(`File ${file.name} exceeds ${maxFileSize}MB limit`);
                return false;
            }

            const fileExtension = '.' + file.name.split('.').pop()?.toLocaleLowerCase();
            if (!acceptedTypes.includes(fileExtension)) {
                setError(`File type "${fileExtension}" is not supported`);
                return false;
            }

            if (files.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size)) {
                setError(`File ${file.name} already exists`);
                return false;
            }

            return true;
        },
        [maxFileSize, acceptedTypes, maxFiles],
    );

    return { validateFile, error };
};

export default useFileValidate;
