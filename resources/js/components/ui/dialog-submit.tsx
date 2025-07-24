import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';

interface DialogSubmitProps<T> { 
    submitFn: (param?: T) => void;
    cancelFn?: (param?: T) => void;
    config: DialogConfig;
}

interface DialogConfig {
    triggerContent: ReactNode;
    titleContent: string;
    descriptionContent: string;
    warningTextContent?: string;
    closeBtn: string;
    submitBtn: string;
    submitBtnVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    warningText?: boolean;
}

const DialogSubmit = ({ submitFn, cancelFn, config }: DialogSubmitProps<number>) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleCloseModal = () => {
        if (typeof cancelFn === 'function') cancelFn();
        setShowModal(false)
    };

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
                {config.triggerContent}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{config.titleContent}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {config.descriptionContent}
                    {config.warningText && (
                        <small className="mt-4 inline-block text-red-400">
                            {config.warningTextContent}
                        </small>
                    )}
                </DialogDescription>
                <DialogFooter>
                    <Button variant={'outline'} onClick={() => handleCloseModal()}>
                        {config.closeBtn}
                    </Button>
                    <Button onClick={() => submitFn()} variant={config.submitBtnVariant}>
                        {config.submitBtn}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DialogSubmit;
