import NoLessonMessage from '@/components/history/no-lesson-message';
import PreviousLessons from '@/components/history/previous-lessons';
import { Button } from '@/components/ui/button';
import DialogSubmit from '@/components/ui/dialog-submit';
import { Input } from '@/components/ui/input';
import useLessonDelete from '@/hooks/useLessonDelete';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LessonResponse, PaginatedResponse } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCheck, PlusIcon, Search } from 'lucide-react';

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

    const { selected, setSelected, handleSelected, handleDeleteItems, handleConfirmDialog } = useLessonDelete();

    const selectAllItems = () => {
        if (!lessons.data.length) return;
        // Remove all existing items first then fill it up again
        setSelected([]);
        lessons.data.map((lesson: LessonResponse) => setSelected((prevLesson) => [...prevLesson, lesson.id]));
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

                {/* Stats start */}
                <div className="mb-4 flex items-center justify-between">
                    {selected.length ? (
                        <div className="flex items-center justify-center gap-2">
                            <CheckCheck className="text-primary-green" />
                            <p className="text-primary-green">{selected.length} selected lessons</p>
                        </div>
                    ) : (
                        <small>You have {lessons.data.length} previous lesson with Aralith</small>
                    )}
                    <div className="flex items-center justify-between">
                        {selected.length !== lessons.data.length && (
                            <Button variant={'link'} onClick={selectAllItems} size={'sm'}>
                                Select All
                            </Button>
                        )}
                        {/* Delete handlers */}
                        {selected.length > 0 && (
                            <div className="flex gap-2">
                                <Button variant={'outline'} size={'sm'} onClick={() => setSelected([])}>
                                    Cancel
                                </Button>
                                {/* Reuseable Dialog component with custom messages and functions */}
                                <DialogSubmit
                                    submitFn={handleDeleteItems}
                                    config={{
                                        triggerContent: (
                                            <Button variant={'destructive'} size={'sm'}>
                                                Delete Selected
                                            </Button>
                                        ),
                                        titleContent: 'Delete selected lessons?',
                                        descriptionContent: `Are you sure you want to delete ${selected.length} lessons? `,
                                        warningTextContent: 'This action cannot be undone.',
                                        closeBtn: 'Cancel',
                                        submitBtn: 'Delete',
                                        submitBtnVariant: 'destructive',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                {/* Stats end */}

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
