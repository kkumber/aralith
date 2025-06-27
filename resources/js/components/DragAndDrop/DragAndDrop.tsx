import { isValidFileSize, isValidFileType } from '@/lib/utils';
import { defaultAcceptedTypes, defaultMaxFiles } from '@/pages/quiz/config/config';
import { FileWarning } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import DropZone from './DropZone';
import FileList from './FileList';

interface DragAndDropProps {
    onFilesSelected: (files: File[]) => void;
    handleFilesSubmit: (e: React.FormEvent) => void;
    width?: string | number;
    height?: string | number;
    maxFileSize?: number; // in MB
    acceptedTypes?: string[];
    maxFiles?: number;
}

const DragAndDrop = ({
    onFilesSelected,
    handleFilesSubmit,
    width = '100%',
    height = 'auto',
    maxFileSize = 10,
    acceptedTypes = defaultAcceptedTypes,
    maxFiles = defaultMaxFiles,
}: DragAndDropProps) => {
    const [files, setFiles] = useState<File[]>([]); // fake copy
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
                if (files.length + filesArrayTemp.length > maxFiles) {
                    setError(`Maximum of ${maxFiles} files per upload allowed`);
                    return;
                }

                if (!isValidFileSize(file, maxFileSize)) {
                    setError(`File ${file.name} exceeds ${maxFileSize}MB limit`);
                    return;
                }

                if (!isValidFileType(file, acceptedTypes)) {
                    setError('Unsupported File');
                    return;
                }

                if (files.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size)) {
                    setError(`File ${file.name} already exists`);
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

    // Remove Files based on index
    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // helper function
    const handleClearAllFiles = () => {
        setFiles([]);
        setError('');
    };

    // Notify Parent Component of file Change
    useEffect(() => {
        if (typeof onFilesSelected === 'function') {
            onFilesSelected(files);
        }
    }, [files, onFilesSelected]);

    return (
        <section className="space-y-4 rounded-xl border bg-transparent p-4 shadow-md dark:shadow-gray-950" style={{ width, height }}>
            {/* DropZone */}
            <DropZone handleFiles={handleFiles} hasFiles={files.length > 0} config={{ maxFileSize, acceptedTypes }} />

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
                handleClearAllFiles={handleClearAllFiles}
                handleRemoveFile={handleRemoveFile}
                handleFilesSubmit={handleFilesSubmit}
            />
        </section>
    );
};

export default DragAndDrop;
