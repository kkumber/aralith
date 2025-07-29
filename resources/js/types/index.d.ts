import { Configuration, QuestionType } from '@/pages/quiz/config/config';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string | Router;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface UsePost<TInput, TOutput> {
    postData: (payload: TInput) => Promise<TOutput>;
    data: TOutput | null;
    error: string | null;
    isLoading: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface LessonResponse {
    title: string;
    content: string;
    summary: string;
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    flashcard?: FlashcardResponse[];
}

export interface FlashcardResponse {
    question: string;
    answer: string;
    id: number;
    created_at: string;
    updated_at: string;
    lesson_id: number;
}

export interface QuizResponse {
    id: number;
    user_id: number;
    lessons_id?: number;
    questions?: QuestionResponse[];
    title: string;
    config: Configuration;
    created_at: string;
    updated_at: string;
}

export interface QuestionResponse {
    question_text: string;
    options: string[];
    id: number;
    quizzes_id: number;
    type: QuestionType
}

export interface QuestionProp {
    id: number;
    question: string;
    options: string[];
    number: number;
    onChange?: (id: number, answer: string | string[]) => void;
}
