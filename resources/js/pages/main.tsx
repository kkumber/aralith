import InputError from '@/components/input-error';
import LessonInput from '@/components/lesson/lesson-input';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import DialogSubmit from '@/components/ui/dialog-submit';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import AppLayout from '@/layouts/app-layout';
import { getWordCount, retrieveFromSessionStorage, saveToSessionStorage, truncateStringByMaxCount } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
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

    const handleSetLessonContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLessonContent(e.target.value);
    };

    const handleLessonContentSubmit = () => {
        if (!lessonContent) return;

        const cleanText = truncateStringByMaxCount(lessonContent, wordCountLimit);
        saveToSessionStorage('lesson', cleanText);
        router.visit(route('quiz.create'));
    };

    // Only count the words after waiting a few seconds
    useEffect(() => {
        if (lessonContent) {
            const timeout = setTimeout(() => setWordCount(getWordCount(lessonContent)), 500);
            return () => clearTimeout(timeout);
        }
    }, [lessonContent]);

    // Run checks on mount
    useEffect(() => {
        // Check if existing lesson exist in session storage in case of accidental reloads
        const existingLesson = retrieveFromSessionStorage('lesson');

        if (existingLesson) {
            setLessonContent(existingLesson);
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="mx-auto flex h-full max-w-screen-lg flex-1 flex-col gap-4 rounded-xl p-4">
                {uploadError && <InputError message={uploadError} />}
                <DragAndDrop files={files} setFiles={setFiles} handleFilesSubmit={handleFilesSubmit} isLoading={isLoading} />
                <h3 className="text-text-tertiary dark:text-dark-text-tertiary my-8 text-center">or copy and paste the text directly</h3>
                <Card className="w-full rounded-sm">
                    <LessonInput lessonContent={lessonContent} handleSetLessonContent={handleSetLessonContent} wordCount={wordCount} />
                    <CardFooter>
                        <DialogSubmit
                            submitFn={handleLessonContentSubmit}
                            config={{
                                triggerContent: <Button disabled={!lessonContent || isLoading || wordCount < wordCountMin}>Submit</Button>,
                                titleContent: 'Submit Lesson',
                                descriptionContent: 'Please make sure that the lesson is easily understandable for accurate quiz generation.',
                                warningText: wordCount > wordCountLimit,
                                warningTextContent: `The lesson exceeds the word limit. It will be automatically truncated to be below ${wordCountLimit} words.`,
                                closeBtn: 'Close',
                                submitBtn: 'Confirm',
                                submitBtnVariant: 'default',
                            }}
                        />
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Main;
