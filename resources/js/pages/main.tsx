import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import AppLayout from '@/layouts/app-layout';
import { getWordCount, saveToLocalStorage, truncateStringByMaxCount } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import DragAndDrop from '../components/DragAndDrop/DragAndDrop';
import { wordCountLimit, wordCountMin } from './quiz/config/config';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
    },
];
const Main = () => {
    const { uploadError, lessonContent, setLessonContent, isLoading, files, setFiles, handleFilesSubmit } = useFileProcessor();
    const [wordCount, setWordCount] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);

    // Only count the words after waiting a few seconds
    useEffect(() => {
        if (lessonContent) {
            const timeout = setTimeout(() => setWordCount(getWordCount(lessonContent)), 500);
            return () => clearTimeout(timeout);
        }
    }, [lessonContent]);

    // Immediately get the saved lesson on mount. Incase of reloads
    // useEffect(() => {
    //     const existingLesson = retrieveFromLocalStorage('lesson');

    //     if (existingLesson) {
    //         setLessonContent(existingLesson);
    //     }
    // }, []);

    const handleLessonContentSubmit = () => {
        if (!lessonContent) return;

        const cleanText = truncateStringByMaxCount(lessonContent, wordCountLimit);
        saveToLocalStorage('lesson', cleanText);
        router.visit(route('quiz.create'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {uploadError && <InputError message={uploadError} />}
                <DragAndDrop files={files} setFiles={setFiles} handleFilesSubmit={handleFilesSubmit} isLoading={isLoading} />
                <h3 className="text-text-tertiary dark:text-dark-text-tertiary my-8 text-center">or copy and paste the text directly</h3>
                <Card>
                    <CardHeader>Extracted Lesson</CardHeader>
                    <div className="flex flex-col gap-1">
                        <CardDescription>Please check the details before generating quizzes</CardDescription>
                        <textarea
                            name="extracted_texts"
                            id="lessonContent"
                            value={lessonContent}
                            className="h-80 w-full rounded-sm border p-3 focus:outline-0"
                            placeholder="E=mc^2"
                            onChange={(e) => setLessonContent(e.target.value)}
                        ></textarea>
                        <div className="flex items-center justify-end space-x-1">
                            <small className={`text-end font-semibold ${wordCount > wordCountLimit ? 'text-red-400' : ''}`}>
                                Word Limit: <b>{wordCount}</b>/{wordCountLimit}
                            </small>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info size={15} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    We restricted the minimum and maximum amount of words to ensure accurate and meaningful quizzes
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <small className="text-end">Minimum words: {wordCountMin}</small>
                    </div>
                    <CardFooter>
                        <Dialog open={showModal} onOpenChange={setShowModal}>
                            <DialogTrigger asChild>
                                <Button disabled={isLoading || wordCount < wordCountMin}>Create Quiz</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Submit Lesson</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    Please make sure that the lesson is easily understandable for accurate quiz generation.
                                    {wordCount > wordCountLimit && (
                                        <small className="mt-4 inline-block text-red-400">
                                            The lesson exceeds the word limit. It will be automatically truncated to be below 1000 words.
                                        </small>
                                    )}
                                </DialogDescription>
                                <DialogFooter>
                                    <Button variant={'outline'} onClick={() => setShowModal(false)}>
                                        Close
                                    </Button>
                                    <Button onClick={handleLessonContentSubmit}>Confirm</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Main;
