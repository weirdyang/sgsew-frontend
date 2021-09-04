import { CurrencyPipe } from "@angular/common";
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { processCurrency } from "./product.processor";

export function createPriceValidator(currencyPipe: CurrencyPipe): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const price = control.value;
        if (!price) return null;

        if (isNaN(price)) return { 'invalidPrice': true };

        try {
            currencyPipe.transform(processCurrency(price), 'USD', 'symbol')
            return null;
        } catch (error) {
            return { 'invalidPrice': true }
        }
    }
}

const numberRegEx = /^\d+\.?(\d{1,2})?$/;

export const numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (value === '') {
        return null;
    }
    const test = numberRegEx.test(value);

    return test ? null : { 'invalidFloat': true };
}
export const validPrice = function validPrice(value: string) {
    if (!value) return false;

    return numberRegEx.test(value);
}
export const minMaxComparisonValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const max = control.get('max');
    const min = control.get('min');

    if (!min?.value || !max?.value || !min || !max) {

        return null;
    }
    return +min.value >= +max.value
        ? { minMaxError: true }
        : null;
};
export const minMaxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent as FormGroup;

    if (!parent) return null;

    const min = parent?.get('min')?.value;
    const max = parent?.get('max')?.value;

    if (!min || !max) {
        return null;
    }
    if (!validPrice(min) || !validPrice(max)) {
        return null;
    }

    return +min >= +max
        ? { minBigger: true }
        : null;
}

export class ConditionalErrorStateMatcher implements ErrorStateMatcher {
    comparison: () => boolean;
    constructor(predicate: () => boolean) {
        this.comparison = predicate;
    }
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

        return this.comparison();
    }
}
export class InstantErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

        return !!(control && control.invalid && (control.dirty || control.touched));
    }
}