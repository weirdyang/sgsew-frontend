import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
const MAX_SIZE = 10 * 1024 * 1024;
export const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const fileSizeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let validFileSize = false;

    const file = control.value as File;

    if (file) {

        validFileSize = file.size <= MAX_SIZE;

    }
    return validFileSize ? null : { invalidFileSize: true }
}

export const fileTypeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let validType = false;
    const file = control.value as File;
    if (file) {

        validType = validTypes.some(el => el === file.type);
    }

    return validType ? null : { invalidType: true }
}

export const checkFileValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent as FormGroup;
    if (!parent) return null;

    return parent?.get('file')?.errors
        ? { invalidFile: true }
        : null;
}

export const conditionalValidator = function (predicate: () => true, validator: ValidatorFn) {
    return (formControl: AbstractControl) => {
        if (!formControl.parent) {
            return null;
        }
        if (predicate()) {
            return validator(formControl);
        }
        return null;
    };
}