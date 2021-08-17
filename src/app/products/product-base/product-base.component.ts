import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MAX_PRICE } from 'src/app/config';
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
  priceValidators = [Validators.required, Validators.max(MAX_PRICE), Validators.min(1), createPriceValidator(this.currencyPipe)];
  brandValidator = [Validators.required, Validators.minLength(3)]
  _isSubmitting = false;

  minErrorMessage = 'Price must be at least $1.';
  maxErrorMessage = `Max price is ${MAX_PRICE}`;
  invalidErrorMessage = 'Invalid value';
  requiredErrorMessage = 'This is required';
  brandMinErrorMessage = 'Product brand must be at least 3 characters';
  nameMinErrorMessage = 'Product name must be at least 6 characters';
  typeMinErrorMessage = 'Product type must be at least 6 characters';
  descriptionErrorMessage = ' Product description must be at least 6 characters and max 140 characters.';
  imageFormatErrorMessage = 'Only images in png and jpg format are allowed.';
  imageMaxErrorMessage = 'Max file size is 10mb.'
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

      const message = item as IErrorMessage;
      this.errorObject[item.name] = item.error;
    }
  }
  processError(error: IHttpError) {

    if (error.message) {
      this.errorMessage = error.message;
    }
    if (error.additionalInfo) {

    }
    if (error.additionalInfo && error.additionalInfo.length) {

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
