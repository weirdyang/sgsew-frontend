import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IErrorMessage, IHttpError } from 'src/app/types/http-error';
import { createPriceValidator } from '../helpers/price.validator';
import { processCurrency } from '../helpers/product.processor';

@Component({
  templateUrl: './product-base.component.html',
  styleUrls: ['./product-base.component.scss']
})
export class ProductBaseComponent {
  imageSrc: string | ArrayBuffer = '';
  nameValidators = [Validators.required, Validators.minLength(6)];
  descriptionValidators = [Validators.required, Validators.minLength(6), Validators.maxLength(140)];
  productTypes = ['hardware', 'services'];
  productTypeValidators = [Validators.required];
  priceValidators = [Validators.required, createPriceValidator(this.currencyPipe)];
  brandValidator = [Validators.required, Validators.minLength(3)]
  _isSubmitting = false;

  get isSubmitting() {
    return this._isSubmitting
  }
  set isSubmitting(value) {
    this._isSubmitting = value;
  }

  _fileName: string = '';
  set fileName(value) {
    this._fileName = value;
  }
  get fileName() {
    return this._fileName;
  }

  form!: FormGroup;

  constructor(public router: Router, public currencyPipe: CurrencyPipe) { }
  cancel() {
    this.router.navigateByUrl('/');
  }

  errorMessage: string = '';

  errorObject: Record<string, string> = {
    name: '',
    description: '',
    file: '',
    productType: ''
  }
  get formFile() {
    return this.form.get('file');
  }
  processErrorMessage(error: IHttpError) {
    for (const item of error.additionalInfo) {
      console.log(item);
      const message = item as IErrorMessage;
      this.errorObject[item.name] = item.error;
    }
  }
  processError(error: IHttpError) {
    console.log(error);
    if (error.message) {
      this.errorMessage = error.message;
    }
    if (error.additionalInfo) {
      console.log(error.additionalInfo);
    }
    if (error.additionalInfo && error.additionalInfo.length) {
      console.table(error.additionalInfo[0]);
      this.processErrorMessage(error);
    }
    this.isSubmitting = false;
    return EMPTY;
  }


  convertToCurrency(form: any) {
    if (form.price) {
      try {
        this.form.patchValue({
          price: processCurrency(form.price)
        }, { emitEvent: false });
        return EMPTY;
      }
      catch (error) {
        this.form.patchValue({
          price: form.price
        }, { emitEvent: false });
      }
    }
    return EMPTY;
  }
};