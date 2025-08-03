import { Clock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { StepData } from '@/pages/google-forms/data/stepData';


interface StepProps {
    step: StepData;
    index: number;
}

const StepCard = ({ step, index }: StepProps) => {
    const [isExpanded, setIsExpanded] = useState(index === 0);

    return (
        <div className="border-border overflow-hidden rounded-xl border transition-all duration-300 bg-card hover:shadow-md">
            {/* Header */}
            <div className="hover:bg-muted/50 cursor-pointer px-6 py-5 transition-colors duration-200" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border">
                            <span className="text-text-secondary text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-text-primary dark:text-dark-text-primary text-lg font-semibold">{step.title}</h3>
                            <p className="text-text-tertiary dark:text-dark-text-tertiary mt-1 text-sm">{step.description}</p>
                            {step.estimatedTime && (
                                <div className="text-text-tertiary dark:text-dark-text-tertiary mt-2 flex items-center text-xs">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {step.estimatedTime}
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="hover:bg-muted rounded-lg p-2 transition-colors">
                        {isExpanded ? <EyeOff className="text-text-tertiary h-4 w-4" /> : <Eye className="text-text-tertiary h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="border-border/50 border-t px-6 pb-6">
                    <div className="pt-4">{step.content}</div>
                </div>
            )}
        </div>
    );
};

export default StepCard;