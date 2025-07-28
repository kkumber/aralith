import QuizCallToAction from '@/components/quiz/quiz-call-to-action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Flashcard from '@/components/ui/flashcard';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LessonResponse } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BookText, Brain } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Current Lesson',
        href: route('lesson.index'),
    },
];

const Lesson = () => {
    const { lesson } = usePage<{ lesson: LessonResponse }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Current Lesson" />
            <main className="mx-auto max-w-screen-lg space-y-8 p-4">
                <header className="flex items-center gap-2">
                    <BookText className="text-primary-green" size={40} />
                    <h1>
                        Lesson: <span className="text-primary-green">"{lesson.title}"</span>
                    </h1>
                </header>

                {/* Sumamry */}
                <section>
                    <Card className="bg-sidebar shadow-md">
                        <CardHeader>
                            <CardTitle className="text-primary-green text-xl">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{lesson.summary}</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
                    <QuizCallToAction />
                </div>

                {/* Flashcards */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Brain className="text-primary-green" size={40} /> <h2>Flashcards</h2>
                    </div>

                    {lesson.flashcard &&
                        lesson.flashcard.map((flashcard) => (
                            <Flashcard frontcard={flashcard.question} backcard={flashcard.answer} key={flashcard.id} />
                        ))}
                </section>
            </main>
        </AppLayout>
    );
};

export default Lesson;
