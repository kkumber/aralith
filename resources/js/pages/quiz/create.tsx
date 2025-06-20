import BlockBox from '@/components/ui/block-box';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { SubCard } from '@/components/ui/subcard';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

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

const questionTypes: string[] = ['Multiple Choice', 'True/False', 'Multiple Answers', 'Identification', 'Fill in the blank', 'Mixed Questions'];
const difficultyLevels = ['Easy', 'Medium', 'Hard'];

const Create = () => {
    const [numOfQuestions, setNumOfQuestions] = useState<number[]>([10]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="p-6 shadow-md">
                    <CardHeader className="space-y-4">
                        <CardTitle className="text-xl">Presets</CardTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <SubCard title="Vocabulary Drill" description="Multiple choice · 10 questions" className="hover:cursor-pointer" />
                            <SubCard title="True/False Review" description="True/False · 12 questions" className="hover:cursor-pointer" />
                            <SubCard title="Concept Check" description="Multiple Answers · 6 questions" className="hover:cursor-pointer" />
                            <SubCard title="What is it?" description="Identification · 10 questions" className="hover:cursor-pointer" />
                            <SubCard title="Quick Recall" description="Fill in the blank · 10 questions" className="hover:cursor-pointer" />
                            <SubCard
                                title="Mixed Practice"
                                description="MCQ, True/False, Multiple Answers, Identification, Fill in the blank · 25 questions"
                                className="hover:cursor-pointer"
                            />
                        </div>
                    </CardHeader>
                    <hr />
                    <CardContent className="space-y-4">
                        <CardTitle className="text-xl">Advance Configuration</CardTitle>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p>Number of Questions</p>
                                <p>{numOfQuestions}</p>
                            </div>
                            <Slider
                                defaultValue={numOfQuestions}
                                value={numOfQuestions}
                                step={1}
                                max={100}
                                min={1}
                                onValueChange={setNumOfQuestions}
                            />
                            <div className="flex flex-col justify-center gap-2">
                                <p>Question Types</p>
                                <div className="flex flex-wrap gap-2">
                                    {questionTypes.map((type) => (
                                        <BlockBox item={type} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-2">
                                <p>Difficulty Level</p>
                                <div className="flex flex-wrap gap-2">
                                    {difficultyLevels.map((level) => (
                                        <BlockBox item={level} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox />
                                <p>Randomize Question Order</p>
                            </div>
                        </div>
                        <Button className="w-full">Generate Quiz</Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Create;
