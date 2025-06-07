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
    const [selectedFiles, setSelectedFiles] = useState<File[]>();

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
        console.log(`Files Selected: `, files);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DragNdrop onFilesSelected={handleFilesSelected} />
            </div>
        </AppLayout>
    );
};

export default Main;
