import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { FormField } from './FormField';
import { BaseProps, FieldConfig, FormValues, FormSubmitedHandler } from '../../utils/types';
import Button from '../Button/Button';

interface FormProps<T extends FormValues> extends BaseProps {
    fields: FieldConfig[];
    initialValues: T;
    onSubmit?: FormSubmitedHandler<T>;
    submitText?: string;
    loading?: boolean;
}

function Form <T extends FormValues>({
    initialValues,
    fields,
    onSubmit,
    className = '',
    submitText = 'Submit',
    loading = false,
    children,
    ...props
}: FormProps<T>){
    // State for form values, touched fields, and validation errors
    const [values, setValues] = useState<T>(initialValues);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setValues(initialValues);
        setTouched({});
        setErrors({});
    }, [initialValues]);

    const validateField = (name: string, value: any): string | undefined => {
        const field = fields.find(fieldName => fieldName.name === name);
        if (field?.validation) {
            return field.validation(value);
        }
        return undefined;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle different input types
        const inputValue = (type === 'checkbox' && 'checked' in e.target) 
        ? (e.target as HTMLInputElement).checked 
        : value;

        // Update values
        setValues(prev => ({
            ...prev,
            [name]: inputValue
        }));

        // Mark as touched
        if(!touched[name]){
            setTouched(prev => ({
                ...prev,
                [name]: true
            }))
        }

        // Validate field
        const error = validateField(name, inputValue);
        setErrors(prev => ({
            ...prev,
            [name]: error || ''
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = fields.reduce((acc, field) => {
            acc[field.name] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);
        // Validate all fields
        const newErrors: Record<string, string> = {};
        let hasErrors = false;

        fields.forEach(field => {
            const error = validateField(field.name, values[field.name as keyof T]);
            if (error) {
                newErrors[field.name] = error;
                hasErrors = true;
            }
        });

        setErrors(newErrors);

        // Submit if no errors
        if(!hasErrors) onSubmit?.(values);
    }

    return (
        <form className={className} onSubmit={handleSubmit} {...props}>
            {fields.map((field) => (
                <FormField 
                    key={field.name}
                    field={field}
                    value={values[field.name as keyof T]}
                    onChange={handleChange}
                    error={touched[field.name] ? errors[field.name] : undefined}
                />
            ))}
            {children}
            <div className='form-actions'>
                <Button
                    type='submit'
                    disabled={loading}
                    className='btn btn-primary w-100'
                >
                    {loading ? 'Loading...' : submitText}
                </Button>
            </div>
        </form>
    )
}

export default Form