import MultipleChoiceQuestion from '@/components/quiz-types/multiple-choice';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, QuizResponse } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const Show = () => {
    const { quiz } = usePage<{ quiz: QuizResponse }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: quiz.title,
            href: route('lesson.show', { lesson: quiz.lessons_id }),
        },
        {
            title: 'Quiz Attempt',
            href: route('quiz.show', { lesson: quiz.lessons_id }),
        },
    ];

    console.log(usePage());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quiz Attempt" />

            {quiz.questions?.map(
                (question, index) =>
                    question.type === 'Multiple Choice' && (
                        <MultipleChoiceQuestion
                            key={question.id}
                            number={index + 1}
                            question={question.question_text}
                            options={question.options}
                            id={question.id}
                        />
                    ),
            )}
        </AppLayout>
    );
};

export default Show;
