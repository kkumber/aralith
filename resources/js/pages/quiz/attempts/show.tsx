import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, QuizAttemptsResponse, QuizResponse, UserAnswersResponse } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
            <main className="mx-auto flex h-full max-w-screen-lg flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Result Summary */}
                <ResultSummary score={quizAttempt.score} totalNumOfQuestions={userAnswers.length} />

                {/* Questions Breakdown */}
                <QuestionBreakdown />
            </main>
        </AppLayout>
    );
};

export default QuizAttemptShow;
