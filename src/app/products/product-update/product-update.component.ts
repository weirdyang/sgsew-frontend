import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { map, filter, debounceTime, tap, takeUntil, switchMap, catchError, share, merge } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { IProduct, IProductEdit } from 'src/app/types/product';
import { IUser } from 'src/app/types/user';
import { environment } from 'src/environments/environment';
import { validTypes, fileTypeValidator, fileSizeValidator, checkFileValidator, conditionalValidator } from '../helpers/file.validator';
import { isValidImageExtension } from '../helpers/image-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { constructFormData, processCurrency } from '../helpers/product.processor';
import { ProductBaseComponent } from '../product-base/product-base.component';
import { CurrencyPipe, Location } from '@angular/common';
@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss']
})
export class ProductUpdateComponent extends ProductBaseComponent implements OnInit, OnDestroy {



  accepted = validTypes.join();

  form!: FormGroup;
  errorMessage: string = '';
  @ViewChild('createForm', { static: false })
  myForm!: NgForm;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private authService: AuthService,
    public router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public currencyPipe: CurrencyPipe,
    private location: Location) {
    super(router, currencyPipe);
    this.user = this.authService.getUser() as IUser;

  }
  get imageUrl() {
    return `${this.apiUrl}/products/image/${this.product._id}`;
  }
  product!: IProductEdit;
  user!: IUser;
  apiUrl = environment.productApi;
  conditionalFileCheck = conditionalValidator(() => this.form.get('fileName')?.value,
    Validators.compose(
      [Validators.required, fileTypeValidator, fileSizeValidator],
    ) as ValidatorFn);

  private constructFormGroup(product: IProduct) {
    this.form = this.fb.group({
      name: [product.name,
      this.nameValidators],
      description: [product.description, this.descriptionValidators],
      file: ['',
        [this.conditionalFileCheck]],
      productType: [product.productType,
      this.productTypeValidators],
      brand: [
        product.brand,
        this.brandValidator],
      price: [
        processCurrency(product.price.toString()),
        this.priceValidators,
      ],
      fileName: ['',
        [checkFileValidator]]
    });

    this.form.updateValueAndValidity();

  }

  cancel() {
    this.location.back();
  }
  ngOnInit(): void {

    this.route.data.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      ({ product }) => {
        this.product = product;

        this.constructFormGroup(product as IProduct);
        this.imageSrc = this.imageUrl;
      })
    this.form.valueChanges.pipe
      (
        takeUntil(this.destroy$),
      )
      .subscribe(form => {
        this.convertToCurrency(form);
      })
  }


  get formFile() {
    return this.form.get('file');
  }

  onFileSelected(event: Event) {

    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length) {
      const reader = new FileReader();
      const file = files[0];

      reader.onload = () => {
        this.processFile(reader, file);
      }
      this.form.patchValue({
        fileName: file.name,
        file: file,
      });
      this.form.get('file')?.updateValueAndValidity();
      this.form.get('fileName')?.updateValueAndValidity();
      if (isValidImageExtension(file.name)) {
        reader.readAsDataURL(file);
      };
    }
  }
  private processFile(reader: FileReader, file: File) {
    if (reader.result) {
      if (isValidImageExtension(file.name)) {
        this.imageSrc = reader.result;
      }
    }
  }
  undoChanges() {
    this.form = this.fb.group({
      name: [this.product.name,
      this.nameValidators],
      brand: [this.product.brand,
      this.brandValidator],
      description: [this.product.description, this.descriptionValidators],
      file: ['',
        [this.conditionalFileCheck]],
      productType: [this.product.productType,
      this.productTypeValidators],
      fileName: ['',
        [checkFileValidator]]
    });
    this.imageSrc = this.imageUrl;
  }
  protected readonly destroy$ = new Subject();
  private formSubmitSubject = new BehaviorSubject<FormData | null>(null);
  formSubmit$ = this.formSubmitSubject.asObservable()
    .pipe(
      map(value => value as FormData),
      filter(value => value !== null),
      debounceTime(500),
      share(),
      takeUntil(this.destroy$)
    )

  private productSubmitSubject = new BehaviorSubject<IProduct | null>(null);
  productSubmit$ = this.productSubmitSubject.asObservable()
    .pipe(
      map(value => value as IProduct),
      filter(value => value !== null),
      debounceTime(500),
      share(),
      takeUntil(this.destroy$)
    )
  private resetForm(res: any) {
    this.isSubmitting = false
    this.errorMessage = '';
    for (const key in this.errorObject) {
      if (Object.prototype.hasOwnProperty.call(this.errorObject, key)) {
        this.errorObject[key] = '';
      }
    }
    this.snackBar.open('Product updated!', 'OK');
  }
  private formSubscription = this.formSubmit$
    .pipe(
      switchMap(formData =>
        this.postFormData(formData)),
      catchError(err => this.processError(err.error)),
    ).subscribe((res) => this.resetForm(res));

  private postSubscription = this.productSubmit$
    .pipe(
      switchMap(formData =>
        this.postUpdatedProduct(formData)),
      catchError(err => this.processError(err.error)),
    ).subscribe((res) => this.resetForm(res));

  private postUpdatedProduct(prod: IProduct) {
    return this.productService.updateProductDetails(prod, this.product._id)
      .pipe(
        catchError(err => this.processError(err.error))
      );
  }
  private postFormData(formData: FormData) {
    return this.productService.updateProduct(formData, this.product._id)
      .pipe(
        catchError(err => this.processError(err.error))
      );
  };


  submitForm() {
    this.isSubmitting = true;
    const { file } = this.form.value;
    if (file) {
      const formData: FormData = constructFormData(this.form);
      this.formSubmitSubject.next(formData);
    } else {
      const { price } = this.form.value;
      const updatedProduct = {
        ...this.form.value,
        price: processCurrency(price),
      }
      this.productSubmitSubject.next(updatedProduct as IProduct);
    }


  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.formSubscription.unsubscribe();
    this.postSubscription.unsubscribe();
  }
}