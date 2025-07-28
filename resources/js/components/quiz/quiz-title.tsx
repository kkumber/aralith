import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import InputError from '../input-error';
import { CardTitle } from '../ui/card';

interface QuizTitleProps {
    lesson: string;
    handleSetTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
    configErrors: Record<string, string>;
}

const QuizTitle = ({ lesson, handleSetTitle, configErrors }: QuizTitleProps) => {
    return (
        <div className="space-y-4">
            <CardTitle className="text-xl">Uploaded Lesson</CardTitle>
            <div className="grid w-full max-w-sm items-center gap-2">
                {/* Title */}
                <label htmlFor="title">
                    <p>Title</p>
                </label>
                <Input type="text" maxLength={50} placeholder="e.g. The study of thermodynamics" id="title" required onChange={handleSetTitle} />
                {configErrors.title && <InputError message={configErrors.title} />}
            </div>

            {/* Lesson content */}
            <Accordion type="single" collapsible>
                <AccordionItem value="lesson">
                    <AccordionTrigger>
                        <p>Lesson Content</p>
                    </AccordionTrigger>
                    <AccordionContent className="text-balance">
                        <p>{lesson}</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default QuizTitle;
