import InputError from '@/components/input-error';
import LessonInput from '@/components/lesson/lesson-input';
import LessonSubmit from '@/components/lesson/lesson-submit';
import { Card, CardFooter } from '@/components/ui/card';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import AppLayout from '@/layouts/app-layout';
import { getWordCount, retrieveFromSessionStorage } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DragAndDrop from '../components/DragAndDrop/DragAndDrop';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
    },
];
const Main = () => {
    const { uploadError, lessonContent, setLessonContent, isLoading, files, setFiles, handleFilesSubmit } = useFileProcessor();
    const [wordCount, setWordCount] = useState<number>(0);

    // Only count the words after waiting a few seconds
    useEffect(() => {
        if (lessonContent) {
            const timeout = setTimeout(() => setWordCount(getWordCount(lessonContent)), 500);
            return () => clearTimeout(timeout);
        }
    }, [lessonContent]);

    // Immediately get the saved lesson on mount. Incase of reloads
    useEffect(() => {
        const existingLesson = retrieveFromSessionStorage('lesson');

        if (existingLesson) {
            setLessonContent(existingLesson);
        }
    }, []);

    const handleSetLessonContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLessonContent(e.target.value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {uploadError && <InputError message={uploadError} />}
                <DragAndDrop files={files} setFiles={setFiles} handleFilesSubmit={handleFilesSubmit} isLoading={isLoading} />
                <h3 className="text-text-tertiary dark:text-dark-text-tertiary my-8 text-center">or copy and paste the text directly</h3>
                <Card>
                    <LessonInput lessonContent={lessonContent} handleSetLessonContent={handleSetLessonContent} wordCount={wordCount} />
                    <CardFooter>
                        <LessonSubmit lessonContent={lessonContent} isLoading={isLoading} wordCount={wordCount} />
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Main;
