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
    if (!file || !file.name) return false;

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
    if (!str) return;

    const words = str.trim().split(/\s+/);
    const wordCount = words.length;

    if (wordCount > maxCount) {
        const currentStr = words.slice(0, maxCount).join(' ');
        return currentStr;
    }
    return str;
}

export function truncateStringByMaxCharacter(str: string, maxCharacter: number) {
    if (!str) return;

    if (str.length > maxCharacter) {
        return str.slice(0, maxCharacter)
    }

    return str;
}

export function saveToLocalStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function retrieveFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '');
}

export function saveToSessionStorage<T>(key: string, value: T) {
    sessionStorage.setItem(key, JSON.stringify(value));
};

export function retrieveFromSessionStorage(key: string) {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    try {
        return JSON.parse(raw)
    } catch (e) {
        console.error(`Failed to parse sessionStorage[${key}]`, e);
        return null;
  }
}

export function capitalizeFirstLetter(str: string) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Handle non-string or empty inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}