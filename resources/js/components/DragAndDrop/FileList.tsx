import { formatFileSize } from '@/lib/utils';
import { File, X } from 'lucide-react';
import { Button } from '../ui/button';
import DashedLoading from '../ui/dashed-loading';

interface FileListProps {
    files: File[];
    handleFilesSubmit: (param: File[]) => void;
    handleClearAllFiles: () => void;
    handleRemoveFile: (index: number) => void;
    isLoading: boolean;
}

const FileList = ({ files, handleFilesSubmit, handleClearAllFiles, handleRemoveFile, isLoading }: FileListProps) => {
    return (
        <>
            {files && files.length > 0 && (
                <div className="space-y-4" role="container" aria-label="file list">
                    <div className="flex items-center justify-between">
                        <small>Selected Files ({files.length})</small>
                        <Button
                            variant={'destructive'}
                            size={'sm'}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClearAllFiles();
                            }}
                        >
                            Clear All
                        </Button>
                    </div>

                    {/* Showcase Files with a button for one item removal */}
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
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X className="h-4 w-4 hover:cursor-pointer" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {isLoading ? (
                        <DashedLoading mainContent="Extracting..." />
                    ) : (
                        <Button className="w-full" onClick={() => handleFilesSubmit(files)} size={`sm`} disabled={isLoading}>
                            Extract Lessons
                        </Button>
                    )}
                </div>
            )}
        </>
    );
};

export default FileList;
