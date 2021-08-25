import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subject, combineLatest, Subscription, EMPTY, merge } from 'rxjs';
import { debounceTime, filter, share, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HandsetService } from 'src/app/services/core/handset.service';
import { NavigationService } from 'src/app/services/core/navigation.service';
import { ThemingService } from 'src/app/services/core/theming.service';
import { SearchService } from 'src/app/services/search.service';
import { IProductDisplay, IProductResults } from 'src/app/types/product';
import { minMaxComparisonValidator, minMaxValidator, MyErrorStateMatcher, numberValidator, validPrice } from '../helpers/price.validator';
import { ProductsDataSource } from './product-data-source';
import { faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';
import { MAX_PRICE } from 'src/app/config';
import { IUser } from 'src/app/types/user';
import { ProductsService } from 'src/app/services/products.service';
import { IHttpError } from 'src/app/types/http-error';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { DeleteData } from 'src/app/shared/delete-dialog/delete-data';
@Component({
  selector: 'app-product-card-shell',
  templateUrl: './product-card-shell.component.html',
  styleUrls: ['./product-card-shell.component.scss']
})
export class ProductCardShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  protected readonly destroy$ = new Subject();
  searchParams = {
    keyword: '',
    sort: 'nameasc',
    type: '',
    skip: 0,
    limit: 12,
    min: 0,
    max: MAX_PRICE
  }
  alphaDown = faSortAlphaDown;
  alphaUp = faSortAlphaUp;
  private _sortSubject = new BehaviorSubject<string>('nameasc');

  sort$ = this._sortSubject.asObservable()
    .pipe(
      shareReplay(1),
      share()
    );
  sortControl = new FormControl();

  private _keywordSubject = new BehaviorSubject<string>('');
  keyword$ = this._keywordSubject.pipe(
    debounceTime(500),
    shareReplay(1),
    share(),
  );
  private _minSubject = new BehaviorSubject<number>(0);
  min$ = this._minSubject.pipe(
    debounceTime(500),
    shareReplay(1),
    share(),
  );

  onMinChange(event: any) {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    this.max.updateValueAndValidity();
    if (!value) {
      this._minSubject.next(0);
    }
    else if (validPrice(value)) {
      this._minSubject.next(parseFloat(value));
    }
  }
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  min = new FormControl(this.searchParams.min, [numberValidator, minMaxValidator, Validators.min(0)]);
  private _maxSubject = new BehaviorSubject<number>(MAX_PRICE);
  max$ = this._maxSubject.pipe(
    debounceTime(500),
    shareReplay(1),
    share(),
  );
  onMaxChange(event: any) {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    this.min.updateValueAndValidity();
    if (!value) {
      this._maxSubject.next(MAX_PRICE);
    }
    else if (validPrice(value)) {
      this._maxSubject.next(parseFloat(value));
    }

  }
  max = new FormControl(this.searchParams.max, [numberValidator, minMaxValidator, Validators.max(100000), Validators.min(0)]);

  typeControl = new FormControl();
  private _typeSubject = new BehaviorSubject<string>('');
  type$ = this._typeSubject.pipe(
    shareReplay(1),
    share(),
  );

  updateKeyword(event: any) {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    this._keywordSubject.next(value.trim());

  }

  matcher = new MyErrorStateMatcher(() => this.form.invalid)
  search$ = combineLatest(
    [this.sort$,
    this.keyword$,
    this.min$,
    this.max$,
    this.type$]).subscribe(
      ([sort, keyword, min, max, type]) => {
        this.searchParams.sort = sort;
        this.searchParams.keyword = keyword;
        this.searchParams.min = min;

        this.searchParams.max = max;
        this.searchParams.type = type;

        if (this.paginator && this.form.valid) {
          this.paginator.pageIndex = 0
          this.loadProducts()
        };
      }
    )

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(val => this.loadProducts());
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadProducts(): void {
    this.searchParams.skip = this.paginator.pageIndex * this.paginator.pageSize;
    this.searchParams.limit = this.paginator.pageSize;

    const { keyword, sort, type, skip, limit, min, max } = this.searchParams;

    this.dataSource.loadProducts(keyword, sort, type, skip, limit, min, max);
  }
  get showMenu() {
    return this.navigationService.isShown;
  }

  logEvent(data: any) {
    alert(JSON.stringify(data));
  }
  navigateAfterDelete(message: string) {
    if (message) {
      this.snackBar.open(message, 'OK')
    }
    this.router.navigateByUrl('/');
  }

  set showMenu(value) {
    this.navigationService.setShowNav(value);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  breakPoint$ = this.handsetService.isScreenSmall$;

  hideMenu$ = this.breakPoint$
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(result => {
      if (!result) {
        this.showMenu = false;
      }
    })
  isDark$ = this.themingService.darkMode$;
  sortSubscription: Subscription;
  typeSubscription: Subscription;
  form: FormGroup;
  constructor(
    private themingService: ThemingService,
    private handsetService: HandsetService,
    private navigationService: NavigationService,
    private searchService: SearchService,
    private authService: AuthService,
    private productsService: ProductsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.form = new FormGroup({
      min: this.min,
      max: this.max,
      sort: this.sortControl,
      type: this.typeControl,
    }, { validators: minMaxComparisonValidator })

    this.sortSubscription = this.form.controls['sort'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(changes => {
        this._sortSubject.next(changes);
      })
    this.typeSubscription = this.form.controls['type'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(changes => {
        this._typeSubject.next(changes);
      })
  }
  edit(productId: string) {
    this.router.navigateByUrl(`/products/update/${productId}`);
  }
  showError(error: IHttpError) {
    const message = error.message ?? 'This is unexpected, please contact support.';
    this.snackBar.open(message, 'OK');
    return EMPTY;
  }

  openDeleteDialog(product: IProductDisplay) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      propertyValue: product.name,
      propertyName: 'Product Name',
      errorMessage: 'Names do not match'
    } as DeleteData;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.delete(product._id)
        }
      })
  }
  deleteProductAndRefresh(message: string) {
    this.snackBar.open(message, 'OK');
    this.dataSource.loadProducts();
  }
  delete(productId: string) {
    this.productsService.deleteProduct(productId)
      .subscribe({
        next: (res) => this.deleteProductAndRefresh(res.message),
        error: (err) => this.showError(err.error)
      })
  }
  sortOptions = ['nameasc', 'namedesc', 'brandasc', 'nameasc']

  user = this.authService.getUser();
  protected userLoginSubscription = this.authService.currentUser$
    .pipe(
      filter(user => user !== null),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value as IUser) {
        this.user = value as IUser;
      }
    })
  dataSource: ProductsDataSource = new ProductsDataSource(this.searchService);
  loading$ = this.dataSource.loading$;
  private productSubject = new BehaviorSubject<IProductResults | null>(null)
  products$ = this.productSubject.asObservable()
    .pipe(
      shareReplay(1)
    )
  ngOnInit(): void {
    this.dataSource.loadProducts();
  }
}
