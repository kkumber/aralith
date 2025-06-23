import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatFileSize (bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function isValidFileSize (file: File, maxSize: number) {
  if (file.size > maxSize * 1024 * 1024) {
    return false;
  }
  return true;
};

export function isValidFileType (file: File, acceptedTypes: string[]) {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!acceptedTypes.includes(extension)) {
    return false;
  }
  return true;
};