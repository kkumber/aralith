import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface Config {
    maxFileSize: number;
    acceptedTypes: string[];
}

interface DragAndDropProps {
    handleFiles: (arg: FileList | File[]) => void;
    hasFiles: boolean;
    config: Config;
}

const DropZone = ({ handleFiles, hasFiles, config }: DragAndDropProps) => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <div
            role="region"
            aria-label="file dropzone"
            className={`${isDragOver ? 'border-primary-green scale-[1.02]' : hasFiles ? 'border-primary-green bg-green-50 dark:bg-green-950' : ''} hover:border-secondary-green relative cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all duration-200`}
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
                            Limit {config.maxFileSize}MB per file • Supported Files: {config.acceptedTypes.join(', ')}
                        </small>
                    </div>
                </div>
                <label htmlFor="file-upload" className="sr-only">
                    Upload files
                </label>
                <input
                    name="file-upload"
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={config.acceptedTypes.join(',')}
                    multiple
                />{' '}
            </div>
        </div>
    );
};

export default DropZone;
