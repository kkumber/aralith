import DragNdrop from '@/components/ui/DragNdrop';
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
    const [files, setFiles] = useState<File[]>();

    const handleFilesSelected = (files: File[]) => {
        setFiles(files);
        console.log(`Files Selected: `, files);
    };

    const handleFilesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files || files.length === 0) return;

        const formData = new FormData();

        files.map((file) => formData.append('file', file));

        const res = await fetch('http://127.0.0.1:8000/upload-document/', { method: 'POST', body: formData });
        const data = await res.json();
        console.log(data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DragNdrop onFilesSelected={handleFilesSelected} handleFilesSubmit={handleFilesSubmit} />
            </div>
        </AppLayout>
    );
};

export default Main;
