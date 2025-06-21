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

interface Configuration {
    question_types: string[];
    difficulty: string;
    total_number_of_questions: number;
    random_order: boolean;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const difficultyLevels: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const presets = [
    { type: 'Multiple Choice', selected: false, title: 'Vocabulary Drill', description: 'Multiple choice · 10 questions', numOfQuestions: 10 },
    { type: 'True/False', selected: false, title: 'True/False Review', description: 'True/False · 12 questions', numOfQuestions: 12 },
    { type: 'Multiple Answers', selected: false, title: 'Concept Check', description: 'Multiple Answers · 6 questions', numOfQuestions: 6 },
    { type: 'Identification', selected: false, title: 'What is it?', description: 'Identification · 10 questions', numOfQuestions: 10 },
    { type: 'Fill in the blank', selected: false, title: 'Quick Recall', description: 'Fill in the blank · 10 questions', numOfQuestions: 10 },
    {
        type: 'Mixed',
        selected: false,
        title: 'Mixed Practice',
        description: 'MCQ, True/False, Multiple Answers, Identification, Fill in the blank · 25 questions',
        numOfQuestions: 25,
    },
];

const questionTypes: string[] = presets.map((p) => p.type);

const Create = () => {
    const [numOfQuestions, setNumOfQuestions] = useState<number>(10);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [randomOrder, setRandomOrder] = useState<boolean>(true);
    const [currentPreset, setCurrentPreset] = useState<string>('');

    // The default quiz config. Can be changed.
    const configuration: Configuration = {
        question_types: [],
        difficulty: difficulty,
        total_number_of_questions: numOfQuestions,
        random_order: randomOrder,
    };

    // When a preset is clicked, it changes the configuration
    const handlePreset = (type: string, numOfQuestions: number) => {
        if (!type) return;
        if (!questionTypes.includes(type)) return;

        const configQuestionTypes = configuration.question_types;

        // Clear the array if there are existing presets
        if (configQuestionTypes && configQuestionTypes.length > 0) {
            configQuestionTypes.length = 0;
        }

        configQuestionTypes.push(type);
        setCurrentPreset(type);
        setNumOfQuestions(numOfQuestions);
    };

    // In advance configuration, users can set multiple question types
    const handleAdvanceConfig = (type: string) => {
        if (!type) return;
        if (!questionTypes.includes(type)) return;

        let configQuestionTypes = configuration.question_types;

        // If chosen type is mixed, remove all existing types and replace with mixed
        if (type === 'Mixed') {
            configQuestionTypes.length = 0;
            return configQuestionTypes.push(type);
        }

        // If there is a Mixed type, remove it
        if (configQuestionTypes.includes('Mixed')) {
            configQuestionTypes.pop();
        }

        if (configQuestionTypes.includes(type)) {
            const filteredConfig = configQuestionTypes.filter((existingType) => existingType !== type);
            return console.log((configQuestionTypes = filteredConfig));
        }
        configQuestionTypes.push(type);
    };

    const handleGenerateQuiz = () => {
        // Submit the config
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Lessons" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="p-6 shadow-md">
                    <CardHeader className="space-y-4">
                        <CardTitle className="text-xl">Presets</CardTitle>
                        <div className="flex flex-1 flex-wrap gap-4">
                            {presets.map((p) => (
                                <SubCard
                                    title={p.title}
                                    description={p.description}
                                    key={p.type}
                                    onClick={() => handlePreset(p.type, p.numOfQuestions)}
                                    className={`${currentPreset === p.type ? 'bg-primary-green' : 'bg-light-surface dark:bg-dark-surface'}`}
                                />
                            ))}
                        </div>
                    </CardHeader>
                    <hr />
                    <CardContent className="space-y-4">
                        <CardTitle className="text-xl">Advance Configuration</CardTitle>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p>Number of Questions (need icon when hover shows tooltip that divides num of questions equal to the total types)</p>
                                <p>{numOfQuestions}</p>
                            </div>
                            <Slider
                                defaultValue={[numOfQuestions]}
                                value={[numOfQuestions]}
                                step={1}
                                max={50}
                                min={1}
                                onValueChange={(val: number[]) => setNumOfQuestions(val[0] ?? 10)}
                            />
                            <div className="flex flex-col justify-center gap-2">
                                <p>Question Types</p>
                                <div className="flex flex-wrap gap-2">
                                    {presets.map((p, index) => (
                                        <BlockBox item={p.type} key={index} onClick={() => handleAdvanceConfig(p.type)} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-2">
                                <p>Difficulty Level</p>
                                <div className="flex flex-wrap gap-2">
                                    {difficultyLevels.map((level, index) => (
                                        <BlockBox item={level} key={index} />
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
