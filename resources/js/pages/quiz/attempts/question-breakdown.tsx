import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface Props {
    questionNumber: number;
    question: string | undefined;
    userAnswer: string;
    explanation: string | undefined;
    isCorrect: boolean;
    correctAnswer: string | string[] | undefined;
}

const QuestionBreakdown = ({ questionNumber, question, userAnswer, explanation, isCorrect, correctAnswer }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Question {questionNumber}{' '}
                    {isCorrect ? (
                        <Check className="bg-primary-green rounded-full p-1 text-white dark:text-black" />
                    ) : (
                        <X className="rounded-full bg-red-600 p-1 text-white dark:bg-red-400 dark:text-black" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{question}</p>

                <div className="mt-4 rounded-sm border p-3">
                    <div className="">
                        <small>
                            <span className="text-primary-green">User answer: </span> {userAnswer ? userAnswer : 'N/A'}
                        </small>
                    </div>
                    <div className="">
                        <small>
                            <span className="text-primary-green">Correct answer: </span>{' '}
                            {Array.isArray(correctAnswer) ? correctAnswer?.join(', ') : correctAnswer}
                        </small>
                    </div>
                    <div className="">
                        <small>
                            <span className="text-primary-green">Explanation: </span>
                            {explanation}
                        </small>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuestionBreakdown;
