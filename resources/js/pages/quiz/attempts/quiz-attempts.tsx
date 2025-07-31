import { convertDateToHumanReadable } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Calendar, CheckCircle, ListCheck, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface Props {
    quizId: number;
    quizAttemptId: number;
    quizAttemptNumber: number;
    passed: boolean;
    score: number;
    totalNumOfQuestions: number;
    date: string;
}

const QuizAttemptsList = ({ quizId, quizAttemptId, quizAttemptNumber, passed, score, totalNumOfQuestions, date }: Props) => {
    return (
        <div className="border-muted flex flex-col items-start justify-between gap-2 border p-4 md:flex-row md:items-center">
            {/* Header */}
            <div className="flex items-center gap-2">
                {passed ? <CheckCircle className="text-primary-green" /> : <XCircle className="text-red-600 dark:text-red-400" />}
                <div className="flex max-md:items-center max-md:space-x-2 md:flex-col">
                    <h3>Attempt {quizAttemptNumber}</h3>
                    <small className={`${passed ? 'text-primary-green' : 'text-red-600 dark:text-red-400'}`}>{passed ? 'Passed' : 'Failed'}</small>
                </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2">
                <ListCheck className="text-primary-green" />
                <small>
                    Score: {score}/{totalNumOfQuestions}
                </small>
            </div>

            {/* Time Taken */}
            <div className="flex items-center gap-2">
                <Calendar className="text-primary-green" />
                <small>Date Taken: {convertDateToHumanReadable(date)}</small>
            </div>

            {/* Actions */}
            <div className="">
                <Button variant={'secondary'} size={'sm'} asChild>
                    <Link href={route('quizAttempt.show', { quiz: quizId, quizAttempt: quizAttemptId })}>Review</Link>
                </Button>
            </div>
        </div>
    );
};

export default QuizAttemptsList;
