import DragNdrop from '@/components/ui/DragNdrop';
import usePost from '@/hooks/usePost';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: '/main',
    },
];

const Main = () => {
    const { postData, data, error, isLoading } = usePost('http://127.0.0.1:8000/upload-document/');
    const [files, setFiles] = useState<File[]>();

    const handleFilesSelected = (files: File[]) => {
        setFiles(files);
        console.log(`Files Selected: `, files);
    };

    const handleFilesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files || files.length === 0) return;
        // Might add some catch for file sizes and types

        const formData = new FormData();

        files.map((file) => formData.append('file', file));

        await postData(formData);
    };
    const extractedText = data?.results[0].extracted_texts[0].chunk.text;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DragNdrop onFilesSelected={handleFilesSelected} handleFilesSubmit={handleFilesSubmit} />
                <textarea name="extracted_texts" id="" cols={20} rows={20}>
                    <pre>{extractedText}</pre>
                </textarea>
            </div>
        </AppLayout>
    );
};

export default Main;
