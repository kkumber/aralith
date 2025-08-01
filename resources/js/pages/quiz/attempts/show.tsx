import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, QuizAttemptsResponse, QuizResponse, UserAnswersResponse } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ListCheck } from 'lucide-react';
import QuestionBreakdown from './question-breakdown';
import ResultSummary from './result-summary';
const QuizAttemptShow = () => {
    const { quiz, userAnswers, quizAttempt } = usePage<{
        quiz: QuizResponse;
        userAnswers: UserAnswersResponse[];
        quizAttempt: QuizAttemptsResponse;
    }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: quiz.title,
            href: route('lesson.show', { lesson: quiz.lessons_id }),
        },
        {
            title: `${quiz.title} Quiz Results`,
            href: '#',
        },
    ];

    console.log(usePage());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${quiz.title} Quiz Results`} />
            <main className="mx-auto flex h-full max-w-screen-lg flex-1 flex-col gap-12 rounded-xl p-4">
                {/* Result Summary */}
                <ResultSummary score={quizAttempt.score} totalNumOfQuestions={userAnswers.length} />

                {/* Questions Breakdown */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ListCheck className="text-primary-green" />
                        <h2>Questions Breakdown</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        {userAnswers.map((userAnswer, index) => (
                            <QuestionBreakdown
                                key={userAnswer.id}
                                questionNumber={index + 1}
                                question={userAnswer.questions?.question_text}
                                userAnswer={userAnswer.answer_text}
                                explanation={userAnswer.questions?.explanation}
                                isCorrect={userAnswer.is_correct}
                                correctAnswer={userAnswer.questions?.correct_answer}
                            />
                        ))}
                    </div>
                </section>

                <footer className="flex justify-end">
                    <Button asChild>
                        <Link href={route('lesson.show', { lesson: quiz.lessons_id })}>Back to Lesson</Link>
                    </Button>
                </footer>
            </main>
        </AppLayout>
    );
};

export default QuizAttemptShow;
