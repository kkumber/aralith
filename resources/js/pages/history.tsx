import LessonSearch from '@/components/history/lesson-search';
import LessonSelectionControls from '@/components/history/lesson-selection-controls';
import NoLessonMessage from '@/components/history/no-lesson-message';
import PreviousLessons from '@/components/history/previous-lessons';
import { Button } from '@/components/ui/button';
import useLessonDelete from '@/hooks/useLessonDelete';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LessonResponse, PaginatedResponse } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
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

    console.log(usePage().props);

    const { selected, setSelection, handleSelected, handleDeleteItems, handleConfirmDialog } = useLessonDelete();

    // Select all items that exists
    const selectAllItems = () => {
        if (!lessons.data.length) return;
        const lessonIds = lessons.data.map((lesson: LessonResponse) => lesson.id);
        setSelection(lessonIds);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History" />
            <main className="mx-auto flex h-full w-full max-w-screen-lg flex-col p-4">
                {/* Header start */}
                <div className="flex items-center justify-between">
                    <h1 className="self-start text-start font-medium">Your previous lessons</h1>
                    <Button className="flex items-center justify-center" asChild>
                        <Link href={route('main')}>
                            <PlusIcon />
                            New Quiz
                        </Link>
                    </Button>
                </div>

                {/* Search component */}
                <LessonSearch />

                {/* Selection controls */}
                <LessonSelectionControls
                    lessons={lessons}
                    selected={selected}
                    setSelection={setSelection}
                    handleSelected={handleSelected}
                    handleDeleteItems={handleDeleteItems}
                    handleConfirmDialog={handleConfirmDialog}
                    selectAllItems={selectAllItems}
                />

                {/* Show previous lessons or no lesson message based on data */}
                {lessons && lessons.data.length ? (
                    <PreviousLessons
                        lessons={lessons.data}
                        selected={selected}
                        handleSelected={handleSelected}
                        handleDeleteItems={handleDeleteItems}
                        handleConfirmDialog={handleConfirmDialog}
                    />
                ) : (
                    <NoLessonMessage />
                )}
            </main>
        </AppLayout>
    );
};

export default History;
