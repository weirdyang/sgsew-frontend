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
    const numberRegEx = /^\d{0,8}(\.\d{1,4})?$/.test(value);
    return numberRegEx ? null : { 'invalidFloat': true };
}