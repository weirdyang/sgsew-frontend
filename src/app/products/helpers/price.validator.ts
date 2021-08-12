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
            console.log(result);
            console.log('ok');
            return null;
        } catch (error) {
            console.log('bad');
            return { 'invalidPrice': true }
        }
    }
}