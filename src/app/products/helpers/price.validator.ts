import { ContentObserver } from "@angular/cdk/observers";
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
            const result = currencyPipe.transform(processCurrency(price), 'USD', 'symbol')
            return null;
        } catch (error) {
            return { 'invalidPrice': true }
        }
    }
}


export const numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    const numberRegEx = /^\d{0,23}(\.\d{1,4})?$/.test(value);
    console.log(value, numberRegEx);
    return numberRegEx ? null : { 'invalidFloat': true };
}

export const minMaxComparisonValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const max = control.get('max');
    const min = control.get('min');

    if (!min?.value || !max?.value || !min || !max) {
        console.log(max, 'max');
        return null;
    }
    return +min.value >= +max.value
        ? { minMaxError: true }
        : null;
};
export const minMaxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent as FormGroup;
    console.log(control.value);
    if (!parent) return null;
    const min = parent?.get('min')?.value;
    const max = parent?.get('max')?.value;
    if (!min || !max) {
        console.log(max, 'max');
        return null;
    }
    if (!validPrice(min) || !validPrice(max)) {
        return null;
    }
    if (!min) return null;
    if (!max) return null;

    return +min >= +max
        ? { minBigger: true }
        : null;
}
export const validPrice = function validPrice(value: string) {
    if (!value) return false;

    return /^\d{0,24}(\.\d{1,4})?$/.test(value);
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    comparison: () => boolean;
    constructor(predicate: () => boolean) {
        this.comparison = predicate;
    }
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

        return this.comparison();
    }
}