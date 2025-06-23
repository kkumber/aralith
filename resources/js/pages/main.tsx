import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import DragNdrop from '@/components/ui/DragNdrop';
import usePost from '@/hooks/usePost';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, UsePost } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
    },
];

interface FileExtractionResult {
    results: Results[];
    total_files: number;
    successful_files: number;
    failed_files: number;
}

interface Results {
    filename: string;
    mime_type: string;
    file_size: string;
    status: ExtractionStatus;
    extracted_texts: ExtractedTexts[];
}

interface ExtractedTexts {
    chunk_id: number;
    chunk: TextChunk;
}

interface TextChunk {
    text: string;
    word_count: number;
}

type ExtractionStatus = 'success' | 'failed' | 'processing' | 'pending' | 'error';

const Main = () => {
    const { postData, data, error, isLoading }: UsePost<FormData, FileExtractionResult> = usePost('http://127.0.0.1:8000/upload-document/');
    const [files, setFiles] = useState<File[]>();
    const [lessonContent, setLessonContent] = useState<string>();

    const handleFilesSelected = (files: File[]) => {
        setFiles(files);
    };

    // Submit the files to microservice API for text extraction
    const handleFilesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files || files.length === 0) return;

        const formData = new FormData();

        files.map((file) => formData.append('file', file));

        await postData(formData);
    };

    const handleLessonContentSubmit = () => {
        // Cache ddata then go to options page
    };

    useEffect(() => {
        if (data) {
            setLessonContent(data?.results[0].extracted_texts[0].chunk.text);
        }
    }, [data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DragNdrop onFilesSelected={handleFilesSelected} handleFilesSubmit={handleFilesSubmit} />
                <h3 className="my-8 text-center">or copy and paste the text directly</h3>
                <Card>
                    <CardHeader>Extracted Lesson</CardHeader>
                    <CardDescription>Please check the details before generating quizzes</CardDescription>
                    <textarea
                        name="extracted_texts"
                        id="lessonContent"
                        value={lessonContent}
                        className="h-80 w-full rounded-sm border p-3 focus:outline-0"
                        placeholder="E=mc^2"
                        onChange={(e) => setLessonContent(e.target.value)}
                    ></textarea>
                    <CardFooter>
                        <Button asChild>
                            <Link href={route('quiz.create')}>Configure Quiz</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Main;
