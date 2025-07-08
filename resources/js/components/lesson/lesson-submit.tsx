import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { saveToLocalStorage, truncateStringByMaxCount } from '@/lib/utils';
import { wordCountLimit, wordCountMin } from '@/pages/quiz/config/config';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface LessonSubmitProps {
    lessonContent: string | undefined;
    isLoading: boolean;
    wordCount: number;
}

const LessonSubmit = ({ lessonContent, isLoading, wordCount }: LessonSubmitProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleLessonContentSubmit = () => {
        if (!lessonContent) return;

        const cleanText = truncateStringByMaxCount(lessonContent, wordCountLimit);
        saveToLocalStorage('lesson', cleanText);
        router.visit(route('quiz.create'));
    };

    return (
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
                            The lesson exceeds the word limit. It will be automatically truncated to be below {wordCountLimit} words.
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
    );
};

export default LessonSubmit;
