import { ContentObserver } from "@angular/cdk/observers";
import { CurrencyPipe } from "@angular/common";
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { processCurrency } from "./product.processor";

export function createPriceValidator(currencyPipe: CurrencyPipe): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const price = control.value;
        console.log(control.value);
        if (!price) return null;

        if (isNaN(price)) return { 'invalidPrice': true };

        try {
            const result = currencyPipe.transform(processCurrency(price), 'USD', 'symbol')
            return null;
        } catch (error) {
            console.log('bad');
            return { 'invalidPrice': true }
        }
    }
}


export const numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    console.log(value);
    const numberRegEx = /^\d{0,23}(\.\d{1,4})?$/.test(value);
    return numberRegEx ? null : { 'invalidFloat': true };
}
export const minMaxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent as FormGroup;
    if (!parent) return null;
    console.error(parent?.get('min')?.value, parent?.get('max')?.value, 'min');
    return parent?.get('min')?.value < parent?.get('max')?.value ?
        null : { minBigger: true };
}
export const validPrice = function validPrice(value: string) {
    return /^\d{0,24}(\.\d{1,4})?$/.test(value);
}