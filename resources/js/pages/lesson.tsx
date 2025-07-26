import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Current Lesson',
        href: route('lesson.index'),
    },
];

const Lesson = () => {
    const { lesson } = usePage().props;
    console.log(usePage());
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Current Lesson" />
        </AppLayout>
    );
};

export default Lesson;
