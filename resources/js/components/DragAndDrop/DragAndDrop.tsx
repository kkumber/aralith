import { isValidFileSize, isValidFileType } from '@/lib/utils';
import { defaultAcceptedTypes, defaultMaxFiles } from '@/pages/quiz/config/config';
import { FileWarning } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import DropZone from './DropZone';
import FileList from './FileList';

interface DragAndDropProps<T> {
    width?: string | number;
    height?: string | number;
    maxFileSize?: number; // in MB
    acceptedTypes?: string[];
    maxFiles?: number;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<T>>;
    handleFilesSubmit: (param: File[]) => void;
}

const DragAndDrop = ({
    width = '100%',
    height = 'auto',
    maxFileSize = 10,
    acceptedTypes = defaultAcceptedTypes,
    maxFiles = defaultMaxFiles,
    files,
    setFiles,
    handleFilesSubmit,
}: DragAndDropProps<File[]>) => {
    const [error, setError] = useState<string | null>(null);

    // Main File Handler
    const handleFiles = useCallback(
        (newFiles: FileList | File[]) => {
            if (!newFiles || newFiles.length === 0) return;
            setError('');
            const filesArrayTemp = Array.from(newFiles); // Create new array to handle multiple files
            const validFiles: File[] = []; // copy to save valid files

            // Check each file in the array
            for (const file of filesArrayTemp) {
                if (files) {
                    if (files.length + filesArrayTemp.length > maxFiles) {
                        setError(`Maximum of ${maxFiles} files per upload allowed`);
                        return;
                    }

                    if (files.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size)) {
                        setError(`File ${file.name} already exists`);
                        return;
                    }
                }

                if (!isValidFileType(file, acceptedTypes)) {
                    setError('Unsupported File');
                    return;
                }

                if (!isValidFileSize(file, maxFileSize)) {
                    setError(`File ${file.name} exceeds ${maxFileSize}MB limit`);
                    return;
                }

                validFiles.push(file);
            }

            if (validFiles.length > 0) {
                setFiles((prevFiles) => [...prevFiles, ...validFiles]);
            }
        },
        [files, maxFileSize],
    );

    // helper function
    const handleClearAllFiles = () => {
        setFiles([]);
        setError('');
    };

    // Remove Files based on index
    const handleRemoveFile = (index: number) => {
        if (files) {
            setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        }
    };

    return (
        <section className="space-y-4 rounded-xl border bg-transparent p-4 shadow-md dark:shadow-gray-950" style={{ width, height }}>
            {/* DropZone */}
            <DropZone files={files} handleFiles={handleFiles} hasFiles={files.length > 0} config={{ maxFileSize, acceptedTypes }} />

            {/* Error Message */}
            {error && (
                <div className="mt-4 flex items-center justify-center gap-1 rounded-lg p-3 text-center">
                    <FileWarning className="text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* File List */}
            <FileList
                files={files}
                handleFilesSubmit={handleFilesSubmit}
                handleClearAllFiles={handleClearAllFiles}
                handleRemoveFile={handleRemoveFile}
            />
        </section>
    );
};

export default DragAndDrop;
