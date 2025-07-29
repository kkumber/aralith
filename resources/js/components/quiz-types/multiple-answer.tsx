import { QuestionProp } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
const MultipleAnswerQuestion = ({ id, question, options, number }: QuestionProp) => {
    return (
        <div className="flex flex-col gap-1">
            <p className="font-semibold">
                <span className="text-sm">{number}.</span> {question}
            </p>
            {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Checkbox
                        id={option}
                        value={option}
                        className="data-[state=checked]:bg-primary-green data-[state=checked]:border-primary-green"
                    />
                    <Label htmlFor={option} className="text-base font-normal">
                        {option}
                    </Label>
                </div>
            ))}
        </div>
    );
};

export default MultipleAnswerQuestion;
