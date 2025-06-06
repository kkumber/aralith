import { useState } from 'react';
import DragNdrop from './DragNdrop';

const Main = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>();

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
        console.log(`Files Selected: `, files);
    };

    return (
        <main className="">
            <h1>Upload</h1>
            <DragNdrop onFilesSelected={handleFilesSelected} />
        </main>
    );
};

export default Main;
