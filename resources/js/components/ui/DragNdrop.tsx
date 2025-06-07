import { formatFileSize } from '@/lib/utils';
import { File, FileWarning, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
    onFilesSelected: (files: File[]) => void;
    width?: string | number;
    height?: string | number;
    maxFileSize?: number; // in MB
    acceptedTypes?: string[];
    maxFiles?: number;
}

const DragNdrop = ({
    onFilesSelected,
    width = '100%',
    height = 'auto',
    maxFileSize = 15,
    acceptedTypes = ['.pdf', '.docx', '.pptx', '.txt', '.xlsx'],
    maxFiles = 10,
}: Props) => {
    const [files, setFiles] = useState<File[]>([]); // files array
    const [error, setError] = useState<string>(''); // error messages
    const [isDragOver, setIsDragOver] = useState<boolean>(false); // flag
    const fileInputRef = useRef<HTMLInputElement>(null); // input ref value

    const validateFile = useCallback(
        (file: File): boolean => {
            // check file size -> output error
            if (file.size > maxFileSize * 1024 * 1024) {
                setError(`File ${file.name} exceeds ${maxFileSize}MB limit`);
                return false;
            }

            // check file type -> output error
            const fileExtension = '.' + file.name.split('.').pop()?.toLocaleLowerCase();
            if (!acceptedTypes.includes(fileExtension)) {
                setError(`File type "${fileExtension}" is not supported`);
                return false;
            }
            return true;
        },
        [maxFileSize, acceptedTypes],
    );

    // Main File Handler
    const handleFiles = useCallback(
        (newFiles: FileList | File[]) => {
            setError('');
            const filesArrayTemp = Array.from(newFiles); // Create new array to handle multiple files
            const validFiles: File[] = []; // copy to save valid files

            // Check if the current files being uploaded are gonna exceed the maximum file limit
            if (files.length + filesArrayTemp.length > maxFiles) {
                setError(`Maximum ${maxFiles} files allowed`);
                return;
            }

            // Check each file in the array
            for (const file of filesArrayTemp) {
                // isValid?
                if (!validateFile(file)) {
                    return;
                }

                // has duplicate?
                const isDuplicate = files.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size);
                if (!isDuplicate) {
                    validFiles.push(file);
                }

                if (validFiles.length > 0) {
                    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
                }
            }
        },
        [files, maxFileSize, validateFile],
    );

    // For Browse File Button
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const selectedFile = e.target.files;

        if (selectedFile && selectedFile.length > 0) {
            handleFiles(selectedFile);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // when the dragged item is dropped
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            handleFiles(droppedFiles);
        }
    };

    // When the dragged item enters the div
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    // When the dragged item leaves the div
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    // Remove Files based on index
    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setError('');
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
            <h2>Upload Lessons</h2>
            <div
                className={`${isDragOver ? 'border-secondary-green scale-[1.02]' : files.length > 0 ? 'border-secondary-green bg-green-50 dark:bg-green-950' : ''} hover:border-secondary-green relative cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all duration-200`}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
            >
                {/* Upload Info */}
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-4">
                        <Upload
                            className={`h-12 w-12 transition-colors ${isDragOver ? 'text-secondary-green' : 'text-text-primary dark:text-dark-text-primary'}`}
                        />

                        <div className="space-y-1 text-center">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                {isDragOver ? 'Drop files here' : 'Drag and drop your files here'}
                            </p>
                            <small>
                                Limit {maxFileSize}MB per file • Supported Files: {acceptedTypes.join(', ')}
                            </small>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept={acceptedTypes.join(',')}
                        multiple
                    />{' '}
                </div>
                {/* Error Message */}
                {error && (
                    <div className="mt-4 flex items-center justify-center gap-1 rounded-lg p-3 text-center">
                        <FileWarning className="text-red-600" />
                        <p className="text-sm font-medium text-red-600">{error}</p>
                    </div>
                )}
            </div>
            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <small className="text-sm font-semibold text-gray-700 dark:text-gray-300">Selected Items ({files.length})</small>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClearAllFiles();
                            }}
                            className="text-sm font-medium text-red-600 hover:cursor-pointer hover:text-red-800"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="max-h-48 space-y-2 overflow-auto">
                        {files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors">
                                <div className="flex min-w-0 flex-1 items-center space-x-3">
                                    <File className="text-primary-green h-5 w-5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFile(index);
                                    }}
                                    className="rounded-full p-1 text-gray-500 transition-colors hover:text-red-600"
                                >
                                    <X className="h-4 w-4 hover:cursor-pointer" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default DragNdrop;
