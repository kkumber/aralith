import { getFriendlyErrorMessage, truncateStringByMaxCount } from '@/lib/utils';
import { wordCountLimit } from '@/pages/quiz/config/config';
import { UsePost } from '@/types';
import { useEffect, useState } from 'react';
import * as z from 'zod/v4';
import usePost from './usePost';

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

export const useFileProcessor = () => {
    const { postData, data, error, isLoading }: UsePost<FormData, FileExtractionResult> = usePost('http://127.0.0.1:8000/upload-document/');
    const [files, setFiles] = useState<File[]>([]);
    const [lessonContent, setLessonContent] = useState<string>();
    const [uploadError, setUploadError] = useState<string | null>();

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

    return {
        // state values
        files,
        isLoading,
        uploadError,
        lessonContent,

        // actions for compoment to perform
        setFiles,
        setLessonContent,
        handleFilesSubmit,
    };
};
