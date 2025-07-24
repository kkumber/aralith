import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface DialogSubmitProps { 
    submitFn: () => void;
    config: DialogConfig;
}

interface DialogConfig {
    disableTriggerBtn: boolean;
    triggerContent: string;
    titleContent: string;
    descriptionContent: string;
    warningTextContent?: string;
    closeBtn: string;
    submitBtn: string;
    submitBtnVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    warningText?: boolean;
}

const DialogSubmit = ({ submitFn, config }: DialogSubmitProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
                <Button disabled={config.disableTriggerBtn}>{config.triggerContent}</Button>
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
                    <Button variant={'outline'} onClick={() => setShowModal(false)}>
                        {config.closeBtn}
                    </Button>
                    <Button onClick={submitFn} variant={config.submitBtnVariant}>
                        {config.submitBtn}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DialogSubmit;
