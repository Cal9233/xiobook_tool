import React from 'react';
import { Input, Label, InputContainer } from "../Input/Input";

interface EditableFieldControlsProps {
    fieldName: string;
    isEditable: boolean;
    onToggleEdit: (fieldName: string) => void;
}

export const EditableFieldControls: React.FC<EditableFieldControlsProps> = ({
    fieldName,
    isEditable,
    onToggleEdit
}) => {
    return (
        <InputContainer className="edit-controls d-flex align-items-center position-absolute end-0 top-0 mt-2 me-2">
        <Input
            type="checkbox"
            id={`edit-${fieldName}`}
            checked={isEditable}
            onChange={() => onToggleEdit(fieldName)}
            className="form-check-input me-1"
        />
        <Label htmlFor={`edit-${fieldName}`} className="form-check-label small text-muted">
            Edit
        </Label>
        </InputContainer>
    );
};