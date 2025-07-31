import { isScorePassed, scoreToPercentage } from '@/lib/utils';
import { Award, BarChart } from 'lucide-react';

interface Props {
    score: number;
    totalNumOfQuestions: number;
}

const ResultSummary = ({ score, totalNumOfQuestions }: Props) => {
    return (
        <section className="bg-sidebar flex gap-8 rounded-md p-4">
            <div className="flex flex-col space-y-4">
                <h1>Quiz Results</h1>
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center gap-2 rounded-sm border px-4 py-2">
                        <BarChart className="text-primary-green" size={40} />
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-semibold">{scoreToPercentage(score, totalNumOfQuestions)}%</p>
                            <small>Score</small>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-sm border px-4 py-2">
                        <Award className="text-primary-green" size={40} />
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-semibold">{isScorePassed(score, totalNumOfQuestions) ? 'Passed' : 'Failed'}</p>
                            <small>Status</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <h2 className="border-primary-green flex h-32 w-32 items-center justify-center rounded-full border-8 text-2xl font-bold">
                    {score} / {totalNumOfQuestions}
                </h2>
            </div>
        </section>
    );
};

export default ResultSummary;
