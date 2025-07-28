import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { type HTMLAttributes } from 'react';

export default function InputError({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p {...props} className={cn('flex items-center gap-1 text-sm text-red-600 dark:text-red-400', className)}>
            <AlertCircle className="flex-shink-0" size={14} />
            <span>{message}</span>
        </p>
    ) : null;
}
