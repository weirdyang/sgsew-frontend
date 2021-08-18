import { AbstractControl, ValidatorFn } from "@angular/forms";

export const nameComparisonValidator = function (compare: string) {
    return (formControl: AbstractControl) => {
        const value = formControl.value as string;

        if (compare && value) {
            return compare === value
                ? null
                : { mismatch: true }

        }
        return null;
    };
}