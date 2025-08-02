import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

const GoogleFormExportInstructions = () => {
    console.log(usePage());
    return (
        <AppLayout>
            <Head title="Instructions" />
        </AppLayout>
    );
};

export default GoogleFormExportInstructions;
