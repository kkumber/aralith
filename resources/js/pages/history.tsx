import LessonSelectionControls from '@/components/history/lesson-selection-controls';
import NoLessonMessage from '@/components/history/no-lesson-message';
import PreviousLessons from '@/components/history/previous-lessons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useLessonDelete from '@/hooks/useLessonDelete';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LessonResponse, PaginatedResponse } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PlusIcon, Search } from 'lucide-react';

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
                {/* Header end */}

                {/* Search start */}
                <div className="relative mt-8 mb-3 w-full">
                    <Search size={15} className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 transform" />
                    <Input
                        type="text"
                        name="lesson_search"
                        id="lessonSearch"
                        placeholder="Search your lessons..."
                        className="text-md w-full py-5 pr-5 pl-10"
                    />
                </div>
                {/* Search end */}

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
