import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import AppLayout from '@/layouts/app-layout';
import { getWordCount } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import DragAndDrop from '../components/DragAndDrop/DragAndDrop';
import { wordCountLimit } from './quiz/config/config';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
    },
];
const Main = () => {
    const { uploadError, lessonContent, setLessonContent, isLoading } = useFileProcessor();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {uploadError && <InputError message={uploadError} />}
                <DragAndDrop />
                <h3 className="my-8 text-center">or copy and paste the text directly</h3>
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
                        <small className="text-end">
                            Word Limit: {lessonContent ? getWordCount(lessonContent) : 0}/{wordCountLimit}
                        </small>
                    </div>
                    <CardFooter>
                        <Button asChild disabled={!lessonContent || isLoading}>
                            <Link href={route('quiz.create')}>Configure Quiz</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Main;
