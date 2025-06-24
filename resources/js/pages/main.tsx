import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import DragNdrop from '@/components/ui/DragNdrop';
import usePost from '@/hooks/usePost';
import AppLayout from '@/layouts/app-layout';
import { getFriendlyErrorMessage } from '@/lib/utils';
import { BreadcrumbItem, UsePost } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import * as z from 'zod/v4';

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
    const [zodError, setZodError] = useState<string>();

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
            const result = FileExtractionResultSchema.safeParse(data);
            setZodError('');

            if (!result.success) {
                setZodError('Something went wrong while processing the data.');
                return;
            }
            // Map through the text extraction result and set the lesson content
            const extractedTexts = result.data.results.flatMap((a) => a.extracted_texts);
            const chunks = extractedTexts.map((a) => a.chunk.text);
            const texts = chunks.join('\n\n');

            setLessonContent(texts);
        }
    }, [data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {error && <InputError message={getFriendlyErrorMessage(error)} />}
                {zodError && <InputError message={zodError} />}
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
