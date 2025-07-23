import NoLessonMessage from '@/components/history/no-lesson-message';
import PreviousLessons from '@/components/history/previous-lessons';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LessonResponse, PaginatedResponse } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History" />
            <main className="mx-auto flex h-full max-w-screen-lg flex-col p-4">
                <div className="flex items-center justify-between">
                    <h1 className="self-start text-start font-medium">Previous Lessons</h1>
                    <Button className="flex items-center justify-center">
                        <PlusIcon />
                        New Quiz
                    </Button>
                </div>
                <input type="text" name="lesson_search" id="lessonSearch" placeholder="Search your lessons..." className="border-2" />
                {lessons && lessons.data.length ? <PreviousLessons lessons={lessons.data} /> : <NoLessonMessage />}
            </main>
        </AppLayout>
    );
};

export default History;
