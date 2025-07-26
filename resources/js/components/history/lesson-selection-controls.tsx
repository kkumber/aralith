import { LessonResponse, PaginatedResponse } from '@/types';
import { CheckCheck } from 'lucide-react';
import { Button } from '../ui/button';
import DialogSubmit from '../ui/dialog-submit';

interface Props {
    lessons: PaginatedResponse<LessonResponse>;
    selected: number[];
    setSelection: (param: number[]) => void;
    handleSelected: (id: number) => void;
    selectAllItems: () => void;
    handleDeleteItems: () => void;
    handleConfirmDialog: (id: number) => void;
}

const LessonSelectionControls = ({
    lessons,
    selected,
    setSelection,
    handleSelected,
    selectAllItems,
    handleDeleteItems,
    handleConfirmDialog,
}: Props) => {
    return (
        <div className="mb-4 flex items-center justify-between">
            {selected.length ? (
                <div className="flex items-center justify-center gap-2">
                    <CheckCheck className="text-primary-green" />
                    <p className="text-primary-green">{selected.length} selected lessons</p>
                </div>
            ) : (
                <small>You have {lessons.data.length} previous lesson with Aralith</small>
            )}
            <div className="flex items-center justify-between">
                {selected.length !== lessons.data.length && (
                    <Button variant={'link'} onClick={selectAllItems} size={'sm'}>
                        Select All
                    </Button>
                )}
                {/* Delete handlers */}
                {selected.length > 0 && (
                    <div className="flex gap-2">
                        <Button variant={'outline'} size={'sm'} onClick={() => setSelection([])}>
                            Cancel
                        </Button>
                        {/* Reuseable Dialog component with custom messages and functions */}
                        <DialogSubmit
                            submitFn={handleDeleteItems}
                            cancelFn={() => setSelection([])}
                            config={{
                                triggerContent: (
                                    <Button variant={'destructive'} size={'sm'}>
                                        Delete Selected
                                    </Button>
                                ),
                                titleContent: 'Delete selected lessons?',
                                descriptionContent: `Are you sure you want to delete ${selected.length} lessons? `,
                                warningTextContent: 'This action cannot be undone.',
                                closeBtn: 'Cancel',
                                submitBtn: 'Delete',
                                submitBtnVariant: 'destructive',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonSelectionControls;
