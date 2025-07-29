import { QuestionProp } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
const MultipleAnswerQuestion = ({ id, question, options, number }: QuestionProp) => {
    return (
        <div className="flex flex-col gap-1">
            <p>
                {number}. {question}
            </p>
            {options.map((option, index) => (
                <div key={index} className="ml-8 flex items-center gap-2">
                    <Checkbox id={option} value={option} />
                    <Label htmlFor={option} className="text-base">
                        {option}
                    </Label>
                </div>
            ))}
        </div>
    );
};

export default MultipleAnswerQuestion;
