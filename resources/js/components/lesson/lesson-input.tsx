import { CardDescription, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { wordCountLimit, wordCountMin } from '@/pages/quiz/config/config';
import { Info } from 'lucide-react';

interface LessonInputProps {
    lessonContent: string | undefined;
    handleSetLessonContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    wordCount: number;
}

const LessonInput = ({ lessonContent, handleSetLessonContent, wordCount }: LessonInputProps) => {
    return (
        <>
            <CardHeader>Extracted Lesson</CardHeader>
            <div className="flex flex-col gap-1">
                <CardDescription>Please check the details before generating quizzes</CardDescription>
                <textarea
                    name="extracted_texts"
                    id="lessonContent"
                    value={lessonContent}
                    className="text-text-primary dark:text-dark-text-primary h-80 w-full rounded-xs border p-3 focus:outline-0"
                    placeholder="E=mc^2"
                    onChange={handleSetLessonContent}
                ></textarea>
                <div className="flex items-center justify-end space-x-1">
                    <Tooltip>
                        <TooltipTrigger>
                            <Info size={14} />
                        </TooltipTrigger>
                        <TooltipContent>
                            We restricted the minimum and maximum amount of words to ensure accurate and meaningful quizzes
                        </TooltipContent>
                    </Tooltip>
                    <small className={`text-end font-semibold ${wordCount > wordCountLimit ? 'text-red-400' : ''}`}>
                        Word Limit: <b>{wordCount}</b>/{wordCountLimit}
                    </small>
                </div>
                <small className="text-end">Minimum words: {wordCountMin}</small>
            </div>
        </>
    );
};

export default LessonInput;
