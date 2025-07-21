import NoLessonMessage from '@/components/history/no-lesson-message';
import PreviousLessons from '@/components/history/previous-lessons';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LessonResponse, PaginatedResponse } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'History',
        href: route('lesson.index'),
    },
];

const History = () => {
    const { lessons } = usePage<{
        lessons: PaginatedResponse<LessonResponse>;
    }>().props;
    console.log(lessons);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History" />
            <main className="p-20">
                <h1 className="font-medium">Previous Lessons</h1>
                <PreviousLessons lessons={lessons} />

                {!lessons && <NoLessonMessage />}
            </main>
        </AppLayout>
    );
};

export default History;
