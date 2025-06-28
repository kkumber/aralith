import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidFileSize(file: File, maxSize: number) {
    if (file.size > maxSize * 1024 * 1024) {
        return false;
    }
    return true;
}

export function isValidFileType(file: File, acceptedTypes: string[]) {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (acceptedTypes.includes(extension)) {
        return true;
    }
    return false;
}

export function getFriendlyErrorMessage(error: string): string {
    if (error === 'Failed to fetch') {
        return 'We couldn’t connect to the server. Please check your internet and try again.';
    }
    if (error.includes('timeout')) {
        return 'The request timed out. Please try again later.';
    }
    return error || 'Something went wrong. Please try again.';
}

export function getWordCount(str: string) {
    return str?.trim().split(/\s+/).length || 0;
}

export function truncateStringByMaxCount(str: string, maxCount: number) {
    const words = str.trim().split(/\s+/);
    const wordCount = words.length;

    if (wordCount > maxCount) {
        const currentStr = words.slice(0, maxCount).join(' ');
        return currentStr;
    }
    return str;
}
