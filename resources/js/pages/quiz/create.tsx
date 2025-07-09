import AdvancedConfig from '@/components/quiz/advanced-config';
import QuizPreset from '@/components/quiz/quiz-preset';
import QuizTitle from '@/components/quiz/quiz-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useQuizConfig from '@/hooks/useQuizConfig';
import AppLayout from '@/layouts/app-layout';
import { retrieveFromSessionStorage } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Configuration } from './config/config';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Lessons',
        href: route('main'),
    },
    {
        title: 'Configure Quiz',
        href: route('quiz.create'),
    },
];

const Create = () => {
    const { values, handlers } = useQuizConfig();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [lesson, setLesson] = useState<string>('');

    /* Check if there is lesson on mount, redirect to main if not found */
    useEffect(() => {
        const lesson = retrieveFromSessionStorage('lesson');

        if (!lesson) return setShowModal(true);

        setLesson(lesson);
    });

    const handleReturnModal = () => {
        setShowModal(false);
        router.visit(route('main'));
    };

    /* Submit Config to generate quiz */
    const handleGenerateQuiz = () => {
        const configuration: Configuration = {
            title: values.title,
            question_types: values.selectedTypes,
            difficulty: values.difficulty,
            total_number_of_questions: values.numOfQuestions,
            random_order: values.randomOrder,
        };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />
            {/* Main Container */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="p-8 shadow-md">
                    <QuizPreset handlePreset={handlers.handlePreset} currentPreset={values.currentPreset} />
                    <hr />
                    <CardContent className="space-y-4">
                        <AdvancedConfig
                            numOfQuestions={values.numOfQuestions}
                            handleNumOfQuestions={handlers.handleNumOfQuestions}
                            selectedTypes={values.selectedTypes}
                            handleAdvanceConfig={handlers.handleAdvanceConfig}
                            difficulty={values.difficulty}
                            handleDifficulty={handlers.handleDifficulty}
                            randomOrder={values.randomOrder}
                            handleRandomOrder={handlers.handleRandomOrder}
                        />
                        <hr />
                        <QuizTitle lesson={lesson} handleSetTitle={handlers.handleSetTitle} />
                        <Button className="w-full" onClick={handleGenerateQuiz}>
                            Generate Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Dialog Alert if no lesson is found */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>No Lesson found</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>No lesson found. Please upload a lesson first.</DialogDescription>
                    <DialogFooter>
                        <Button variant={'outline'} onClick={handleReturnModal}>
                            Return
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default Create;
