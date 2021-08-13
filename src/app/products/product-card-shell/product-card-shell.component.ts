import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSliderChange } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, merge, combineLatest } from 'rxjs';
import { debounceTime, share, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HandsetService } from 'src/app/services/core/handset.service';
import { NavigationService } from 'src/app/services/core/navigation.service';
import { SearchService } from 'src/app/services/search.service';
import { IProductResults } from 'src/app/types/product';
import { ProductsDataSource } from './product-data-source';

@Component({
  selector: 'app-product-card-shell',
  templateUrl: './product-card-shell.component.html',
  styleUrls: ['./product-card-shell.component.scss']
})
export class ProductCardShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  protected readonly destroy$ = new Subject();

  private _sortSubject = new BehaviorSubject<string>('nameasc');

  sort$ = this._sortSubject.asObservable()
    .pipe(
      shareReplay(1),
      share()
    );

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
  onMinChange(event: MatSliderChange) {
    console.log(event.value as number)
    this._minSubject.next(event.value as number);
  }
  private _maxSubject = new BehaviorSubject<number>(Number.MAX_SAFE_INTEGER);
  max$ = this._maxSubject.pipe(
    debounceTime(500),
    shareReplay(1),
    share(),
  );

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
  searchParams = {
    keyword: '',
    sort: 'nameasc',
    type: '',
    skip: 0,
    limit: 12,
    min: 0,
    max: Number.MAX_SAFE_INTEGER
  }
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
        console.log(this.searchParams.min, 'min')
        this.searchParams.max = max;
        this.searchParams.type = type;
        if (this.paginator) {
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
    console.log(min);
    this.dataSource.loadProducts(keyword, sort, type, skip, limit, min, max);
  }
  get showMenu() {
    return this.navigationService.isShown;
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
  constructor(
    private snackBar: MatSnackBarModule,
    private handsetService: HandsetService,
    private navigationService: NavigationService,
    private searchService: SearchService,
    private authService: AuthService
  ) { }
  sortOptions = ['nameasc', 'namedesc', 'brandasc', 'nameasc']

  user = this.authService.getUser();

  dataSource: ProductsDataSource = new ProductsDataSource(this.searchService);

  private productSubject = new BehaviorSubject<IProductResults | null>(null)
  products$ = this.productSubject.asObservable()
    .pipe(
      shareReplay(1)
    )
  ngOnInit(): void {
    this.dataSource.loadProducts();
  }
}
