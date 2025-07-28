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
            href: '',
        },
    ];

    console.log(usePage());
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quiz Attempt" />
        </AppLayout>
    );
};

export default Show;
