import { FilePlus2, PlusIcon } from 'lucide-react';
import { Button } from '../ui/button';

const NoLessonMessage = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <FilePlus2 size={80} className="text-text-primary dark:text-dark-text-primary" />
                <b>Ready for your first quiz?</b>
                <p>Upload a file and create a new quiz. Uploaded lessons will show up here.</p>
                <Button variant={'outline'}>
                    <PlusIcon />
                    New Quiz
                </Button>
            </div>
        </div>
    );
};

export default NoLessonMessage;
