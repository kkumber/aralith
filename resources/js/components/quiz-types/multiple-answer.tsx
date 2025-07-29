import { QuestionProp } from '@/types';
import { useEffect, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
const MultipleAnswerQuestion = ({ id, question, options, number, onChange }: QuestionProp) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleCheckboxChange = (option: string, checked: boolean | string) => {
        if (!option) return;

        if (checked) {
            setSelectedOptions((prev) => [...prev, option]);
        } else {
            setSelectedOptions((prev) => prev.filter((prevOption) => prevOption !== option));
        }
    };

    // Update user answers
    useEffect(() => {
        onChange?.(id, selectedOptions);
    }, [selectedOptions]);

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
                        checked={selectedOptions.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange(option, checked)}
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
