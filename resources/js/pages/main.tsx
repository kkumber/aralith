import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import usePost from '@/hooks/usePost';
import AppLayout from '@/layouts/app-layout';
import { getFriendlyErrorMessage, getWordCount, truncateStringByMaxCount } from '@/lib/utils';
import { BreadcrumbItem, UsePost } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import * as z from 'zod/v4';
import DragAndDrop from '../components/DragAndDrop/DragAndDrop';
import { wordCountLimit } from './quiz/config/config';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
    },
];

const ExtractionStatusSchema = z.enum(['success', 'failed', 'processing', 'pending', 'error']);

const TextChunkSchema = z.object({
    text: z.string(),
    word_count: z.number(),
});

const ExtractedTextsSchema = z.object({
    chunk_id: z.number(),
    chunk: TextChunkSchema,
});

const ResultsSchema = z.object({
    filename: z.string(),
    mime_type: z.string(),
    file_size: z.string(),
    status: ExtractionStatusSchema,
    extracted_texts: z.array(ExtractedTextsSchema),
});

const FileExtractionResultSchema = z.object({
    results: z.array(ResultsSchema),
    total_files: z.number(),
    successful_files: z.number(),
    failed_files: z.number(),
});

type FileExtractionResult = z.infer<typeof FileExtractionResultSchema>;

const Main = () => {
    const { postData, data, error, isLoading }: UsePost<FormData, FileExtractionResult> = usePost('http://127.0.0.1:8000/upload-document/');
    const [files, setFiles] = useState<File[]>();
    const [lessonContent, setLessonContent] = useState<string>();
    const [uploadError, setUploadError] = useState<string | null>();

    // Function to pass into child component to update files
    const handleFilesSelected = (files: File[]) => {
        setFiles(files);
    };

    // Submit the files to microservice API for text extraction
    const handleFilesSubmit = async () => {
        if (!files || files.length === 0) return;

        const formData = new FormData();

        files.map((file) => formData.append('file', file));

        await postData(formData);
    };

    const handleLessonContentSubmit = () => {
        // Cache ddata then go to options page or truncate first if over word limit
    };

    // Parse the result from postData and validate against zod schema
    useEffect(() => {
        if (data) {
            const result = FileExtractionResultSchema.safeParse(data);
            setUploadError('');

            if (!result.success) {
                setUploadError('Something went wrong while processing the data.');
                return;
            }
            // Map through the text extraction result and set the lesson content
            const extractedTexts = result.data.results.flatMap((a) => a.extracted_texts);
            const chunks = extractedTexts.map((a) => a.chunk.text);
            const texts = chunks.join('\n\n');
            const truncatedText = truncateStringByMaxCount(texts, wordCountLimit);
            setLessonContent(truncatedText);
        }
    }, [data]);

    // Sync error from postData to uploadError
    useEffect(() => {
        if (error) {
            const readableMsg = getFriendlyErrorMessage(error);
            setUploadError(readableMsg);
        }
    }, [error]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (uploadError) {
            const timeout = setTimeout(() => setUploadError(null), 5000);
            return () => clearTimeout(timeout);
        }
    }, [uploadError]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {uploadError && <InputError message={uploadError} />}
                <DragAndDrop onFilesSelected={handleFilesSelected} handleFilesSubmit={handleFilesSubmit} />
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
