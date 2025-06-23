import { formatFileSize } from '@/lib/utils';
import { File, FileWarning, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { isValidFileSize, isValidFileType } from '@/lib/utils';
import DropZone from '../DragAndDrop/DropZone';

interface Props {
    onFilesSelected: (files: File[]) => void;
    handleFilesSubmit: (e: React.FormEvent) => void;
    width?: string | number;
    height?: string | number;
    maxFileSize?: number; // in MB
    acceptedTypes?: string[];
    maxFiles?: number;
}

const DragNdrop = ({
    onFilesSelected,
    handleFilesSubmit,
    width = '100%',
    height = 'auto',
    maxFileSize = 10,
    acceptedTypes = ['.pdf', '.docx', '.pptx', '.png', '.jpg', '.jpeg', '.webp'],
    maxFiles = 5,

}: Props) => {
    const [files, setFiles] = useState<File[]>([]); 
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
            };
            
            if (validFiles.length > 0) {
                setFiles((prevFiles) => [...prevFiles, ...validFiles]);
            };
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
            <DropZone handleFiles={handleFiles} hasFiles={files.length > 0} config={{maxFileSize, acceptedTypes}}/>
                
            {/* Error Message */}
                {error && (
                    <div className="mt-4 flex items-center justify-center gap-1 rounded-lg p-3 text-center">
                        <FileWarning className="text-red-600" />
                        <p className="text-sm font-medium text-red-600">{error}</p>
                    </div>
            )}
            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <small>Selected Items ({files.length})</small>
                        
                        <Button variant={'destructive'} size={'sm'} onClick={(e) => {
                                e.stopPropagation();
                                handleClearAllFiles();
                            }}>Clear All</Button>
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
                    <Button className="w-full" onClick={handleFilesSubmit} size={`sm`}>
                        Extract Lessons
                    </Button>
                </div>  
            )}
            
        </section>
    );
};

export default DragNdrop;
