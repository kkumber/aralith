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
    showWarningText?: boolean;
    warningTextContent?: string;
    closeBtn: string;
    submitBtn: string;
    submitBtnVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
}

const DialogSubmit = ({ submitFn, cancelFn, config }: DialogSubmitProps<number>) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleCloseModal = () => {
        cancelFn?.();
        setShowModal(false)
    };

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
                {/* Component that triggers the dialog */}
                {config.triggerContent}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    {/* Dialog title */}
                    <DialogTitle>{config.titleContent}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {/* Dialog description */}
                    {config.descriptionContent}

                    {/* Warning text. Optional */}
                    {config.showWarningText && (
                        <small className="mt-4 inline-block text-red-400">
                            {config.warningTextContent}
                        </small>
                    )}
                </DialogDescription>
                <DialogFooter>
                    {/* Cancel and submit buttons */}
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
