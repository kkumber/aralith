import { Link } from '@inertiajs/react';
import { Download, Pencil, Share2 } from 'lucide-react';
import { Button } from '../ui/button';

const QuizCallToAction = ({ lessonId }: any) => {
    return (
        <>
            <Button asChild>
                <Link href={route('quiz.show', { lessonId: lessonId })}>
                    <Pencil />
                    Take Quiz
                </Link>
            </Button>
            <Button variant={'outline'}>
                <Share2 />
                Export to Google Form
            </Button>
            <Button variant={'outline'}>
                <Download />
                Download PDF
            </Button>
        </>
    );
};

export default QuizCallToAction;
