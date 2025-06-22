import { presets, QuestionType } from '@/pages/quiz/config/config';
import { CardHeader, CardTitle } from './ui/card';
import { SubCard } from './ui/subcard';

interface Props {
    handlePreset: (arg1: string, arg2: number) => void;
    currentPreset: QuestionType;
}

const QuizPreset = ({ handlePreset, currentPreset }: Props) => {
    return (
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
    );
};

export default QuizPreset;
