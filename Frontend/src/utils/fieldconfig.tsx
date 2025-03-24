import { FieldConfig } from "./types";

export const clientFields: FieldConfig[] = [
    { 
        name: 'name', 
        label: 'Name', 
        type: 'text', 
        placeholder: 'Enter Name', 
        required: true,
        autoComplete: 'name',
        validation: (value) => {
            if (!value) return 'Name is required';
            if (value.length > 100) return 'Name cannot exceed 100 characters';
            return undefined;
        }
    },
    { 
        name: 'company_name', 
        label: 'Company Name', 
        type: 'text', 
        placeholder: 'Enter Company Name', 
        required: true,
        autoComplete: 'organization',
        validation: (value) => {
            if (!value) return 'Company name is required';
            if (value.length > 100) return 'Company name cannot exceed 100 characters';
            return undefined;
        }
    },
    { 
        name: 'ein', 
        label: 'Ein #', 
        type: 'text', 
        placeholder: 'Enter Ein #', 
        required: true,
        validation: (value) => {
            if (!value) return 'EIN is required';
            // EIN format is typically XX-XXXXXXX (9 digits with a hyphen)
            if (!/^[0-9]{2}-?[0-9]{7}$/.test(value)) 
                return 'Please enter a valid EIN (format: XXXXXXXXX)';
            return undefined;
        }
    },
    { 
        name: 'address', 
        label: 'Address', 
        type: 'text', 
        placeholder: '1234 Main St', 
        required: true,
        autoComplete: 'street-address',
        validation: (value) => {
            if (!value) return 'Address is required';
            if (value.length > 255) return 'Address cannot exceed 255 characters';
            return undefined;
        }
    },
    { 
        name: 'owner_address', 
        label: 'Owner Address', 
        type: 'text', 
        placeholder: '1234 Main St', 
        required: true,
        validation: (value) => {
            if (!value) return 'Owner address is required';
            if (value.length > 255) return 'Owner address cannot exceed 255 characters';
            return undefined;
        }
    },
    { 
        name: 'entity_corp', 
        label: 'Entity Corporation', 
        type: 'text', 
        placeholder: 'Enter Entity Corporation Name', 
        required: true,
        validation: (value) => {
            if (!value) return 'Entity corporation name is required';
            if (value.length > 100) return 'Entity corporation name cannot exceed 100 characters';
            return undefined;
        }
    },
    { 
        name: 'city', 
        label: 'City', 
        type: 'text', 
        placeholder: 'Enter City', 
        required: true,
        autoComplete: 'address-level2',
        validation: (value) => {
            if (!value) return 'City is required';
            if (value.length > 100) return 'City cannot exceed 100 characters';
            return undefined;
        }
    },
    { 
        name: 'state', 
        label: 'State', 
        type: 'text', 
        placeholder: 'State', 
        required: true,
        autoComplete: 'address-level1',
        validation: (value) => {
            if (!value) return 'State is required';
            if (value.length > 2) return 'Please use 2-letter state code';
            return undefined;
        }
    },
    { 
        name: 'phone_num', 
        label: 'Phone Number #', 
        type: 'tel', 
        placeholder: 'Phone Number #', 
        required: true,
        autoComplete: 'tel',
        validation: (value) => {
            if (!value) return 'Phone number is required';
            if (!/^\d{10}$/.test(value)) {
                return 'Please enter a valid 10-digit phone number';
            }
            return undefined;
        }
    }
];

export const employeeFields: FieldConfig[] = [
    {
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        placeholder: 'First Name',
        required: true,
        autoComplete: 'given-name',
        validation: (value) => {
            if (!value) return 'First name is required';
            if (value.length > 100) return 'First name cannot exceed 100 characters';
            return undefined;
        }
    },
    {
        name: 'middle_name',
        label: 'Middle Name',
        type: 'text',
        placeholder: 'Middle Name',
        required: false,
        autoComplete: 'additional-name',
        validation: (value) => {
            if (value && value.length > 100) return 'Middle name cannot exceed 100 characters';
            return undefined;
        }
    },
    {
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Last Name',
        required: true,
        autoComplete: 'family-name',
        validation: (value) => {
            if (!value) return 'Last name is required';
            if (value.length > 100) return 'Last name cannot exceed 100 characters';
            return undefined;
        }
    },
    {
        name: 'ssn',
        label: 'SSN',
        type: 'text',
        placeholder: 'SSN',
        required: true,
        validation: (value) => {
            if (!value) return 'SSN is required';
            if (value.length > 11) return 'SSN cannot exceed 11 characters';
            return undefined;
        }
    },
    {
        name: 'street_address',
        label: 'Street Address',
        type: 'text',
        placeholder: 'Street Address',
        required: true,
        autoComplete: 'street-address',
        validation: (value) => {
            if (!value) return 'Street address is required';
            if (value.length > 255) return 'Street address cannot exceed 255 characters';
            return undefined;
        }
    },
    {
        name: 'city',
        label: 'City',
        type: 'text',
        placeholder: 'City',
        required: true,
        autoComplete: 'address-level2',
        validation: (value) => {
            if (!value) return 'City is required';
            if (value.length > 100) return 'City cannot exceed 100 characters';
            return undefined;
        }
    },
    {
        name: 'state',
        label: 'State',
        type: 'text',
        placeholder: 'State',
        required: true,
        autoComplete: 'address-level1',
        validation: (value) => {
            if (!value) return 'State is required';
            if (value.length > 2) return 'State should use 2-letter code';
            return undefined;
        }
    },
    {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        placeholder: 'Date of Birth',
        required: true,
        autoComplete: 'bday',
        validation: (value) => {
            if (!value) return 'Date of birth is required';
            return undefined;
        }
    },
    {
        name: 'hire_date',
        label: 'Hire Date',
        type: 'date',
        placeholder: 'Hire Date',
        required: true,
        validation: (value) => {
            if (!value) return 'Hire date is required';
            return undefined;
        }
    },
    {
        name: 'job_title',
        label: 'Job Title',
        type: 'text',
        placeholder: 'Job Title',
        required: true,
        validation: (value) => {
            if (!value) return 'Job title is required';
            if (value.length > 255) return 'Job title cannot exceed 255 characters';
            return undefined;
        }
    },
    {
        name: 'i9_date',
        label: 'I-9 Date',
        type: 'date',
        placeholder: 'I-9 Date',
        required: true,
        validation: (value) => {
            if (!value) return 'I-9 date is required';
            return undefined;
        }
    },
    {
        name: 'w4_date',
        label: 'W-4 Date',
        type: 'date',
        placeholder: 'W-4 Date',
        required: true,
        validation: (value) => {
            if (!value) return 'W-4 date is required';
            return undefined;
        }
    },
    {
        name: 'dependents',
        label: 'Dependents',
        type: 'number',
        placeholder: 'Dependents',
        required: true,
        validation: (value) => {
            if (value === undefined || value === null) return 'Number of dependents is required';
            if (value < 0) return 'Dependents cannot be negative';
            return undefined;
        }
    },
    {
        name: 'marital_status',
        label: 'Marital Status',
        type: 'select',
        placeholder: 'Select',
        required: true,
        options: [
            { value: '', label: 'Select' },
            { value: 'single', label: 'Single' },
            { value: 'married_jointly', label: 'Married Jointly' },
            { value: 'married_separately', label: 'Married Separately' },
            { value: 'head_of_household', label: 'Head of Household' }
        ],
        validation: (value) => {
            if (!value) return 'Marital status is required';
            return undefined;
        }
    },
    {
        name: 'employment_status',
        label: 'Employment Status',
        type: 'select',
        placeholder: 'Select',
        required: true,
        options: [
            { value: '', label: 'Select' },
            { value: 'full_time', label: 'Full-Time' },
            { value: 'part_time', label: 'Part-Time' },
            { value: 'temporary', label: 'Temporary' }
        ],
        validation: (value) => {
            if (!value) return 'Employment status is required';
            return undefined;
        }
    },
]

export const employeeTaxFields: FieldConfig[] = [
    { 
        name: 'gross_wages_per_week', 
        label: 'Gross Wages per Week:', 
        type: 'number', 
        placeholder: 'Enter Gross Wages', 
        required: true,
        autoComplete: '0',
        validation: (value) => {
            if (!value) return 'Amount is required';
            if (value.length > 100) return 'Amount cannot exceed 100 characters';
            return undefined;
        }
    },
    { 
        name: 'fed_income_tax_wh', 
        label: 'Federal Income Tax Withholding:', 
        type: 'number', 
        placeholder: 'Enter Federal Income Tax', 
        required: true,
        autoComplete: '0',
        validation: (value) => {
            if (!value) return 'Amount is required';
            if (value.length > 100) return 'Amount cannot exceed 100 characters';
            return undefined;
        }
    },
    { 
        name: 'ca_pit_wh', 
        label: 'California PIT Withholding:', 
        type: 'number', 
        placeholder: 'Enter CA PIT Withholding', 
        required: true,
        autoComplete: 'number',
        validation: (value) => {
            if (!value) return 'CA PIT Withholding is required';
            if (value.length > 100) return 'Amount cannot exceed 100 characters';
            return undefined;
        }
    }
]