import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubCard } from '@/components/ui/subcard';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
    },
    {
        title: 'Configure Quiz',
        href: route('quiz.create'),
    },
];

const Create = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Presets</CardTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <SubCard title="Vocabulary Drill" description="Multiple choice, 10 questions" />
                            <SubCard title="True/False Review" description="True/False, 12 questions" />
                            <SubCard title="Concept Check" description="" />
                            <SubCard title="" description="" />
                            <SubCard title="" description="" />
                        </div>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Create;
