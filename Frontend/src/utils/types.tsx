import { ChangeEvent, ReactNode } from 'react';

// Form base props
export interface BaseProps {
    className?: string;
    children?: ReactNode;
    [key: string]: any;
    id?: string;
}

// Input field configuration
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select';

// Form field configuration
export interface FieldConfig {
    name: string;
    label: string;
    type?: FieldType;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string;
    validation?: (value: any) => string | undefined;
    options?: Array<{value: string, label: string}>;
}

// Form values type - generic to support any structure
export type FormValues<T = Record<string, any>> = T;

// Form change handler types
export type FormChangeHandler<T = FormValues> =
    (name: keyof T, value: any) => void;

export type InputChangeHandler =
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;

// Form submission handler types
export type FormSubmitedHandler<T = FormValues> =
    (values: T) => void | Promise<void>;