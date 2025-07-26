import { getCurrentTimeCustom } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

const useLessonDelete = () => {
    const [selected, setSelected] = useState<number[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleSelected = (id: number) => {
        if (!id) return;

        if (selected.includes(id)) {
            const filtered = selected.filter((prev) => prev !== id);
            return setSelected(filtered);
        }

        setSelected((prev: number[]) => [...prev, id]);
    };

    // Bulk Delete handler
    const handleDeleteItems = () => {
        if (!selected.length) return;

        /* 
            PROBLEM:
            BULK DELETES ONLY DELETES ONE ITEM WHEN 2 ARE SELECTED?
            ONE ITEM IN LESSON_IDS ARE TREATED AS INT NOT ARRAY. NEEDS ARRAY.
        */
        router.post(
            route('lesson.bulkDestroy'),
            { lesson_ids: selected },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Lessons deleted successfully.', {
                        description: getCurrentTimeCustom(),
                    });
                    setSelected([]);
                },
                onError: (errors) => {
                    toast.error(errors?.message || errors?.general || 'Failed to delete lessons. Please try again.');
                },
            },
        );
    };

    // Single item delete
    const handleConfirmDialog = (id: number) => {
        if (!id || deletingId === id) return;

        setDeletingId(id);

        router.delete(route('lesson.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Lesson deleted successfully.', {
                    description: getCurrentTimeCustom(),
                });
                setSelected([]);
            },
            onError: (errors) => {
                toast.error(errors?.message || errors?.general || 'Failed to delete lesson. Please try again.');
            },
            onFinish: () => {
                setDeletingId(null);
            },
        });
    };

    const setSelection = (param: number[]) => {
        if (!Array.isArray(param)) return;
        setSelected(param);
    };

    return {
        selected,
        setSelection,
        handleSelected,
        handleDeleteItems,
        handleConfirmDialog,
    };
};

export default useLessonDelete;
