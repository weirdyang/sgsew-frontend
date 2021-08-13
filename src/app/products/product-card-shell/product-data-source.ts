import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { HttpParams } from "@angular/common/http";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, shareReplay } from "rxjs/operators";
import { SearchService } from "src/app/services/search.service";
import { IProduct, IProductDisplay, IProductResults } from "src/app/types/product";

export class ProductsDataSource implements DataSource<IProductDisplay> {

    private _totalSubject = new BehaviorSubject<number>(0);

    total$ = this._totalSubject.asObservable()
        .pipe(shareReplay(1));

    private _productsSubject = new BehaviorSubject<IProductDisplay[]>([]);

    products$ = this._productsSubject.asObservable()
        .pipe(shareReplay(1))

    private _loadingSubject = new BehaviorSubject<boolean>(false);

    loading$ = this._loadingSubject.asObservable()
        .pipe(shareReplay(1))

    constructor(private searchService: SearchService) {
    }
    connect(collectionViewer: CollectionViewer): Observable<readonly IProductDisplay[]> {
        return this.products$;
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this._loadingSubject.complete();
        this._productsSubject.complete();
    }
    loadProducts(
        keyword: string = '',
        sort: string = 'nameasc',
        type: string = '',
        skip: number = 0,
        limit: number = 12,
        min: number = 0,
        max: number = Number.MAX_SAFE_INTEGER) {

        this._loadingSubject.next(true);

        const params = new HttpParams()
            .set('keyword', keyword)
            .set('sort', sort)
            .set('type', type)
            .set('skip', skip)
            .set('limit', limit)
            .set('min', min)
            .set('max', max)

        console.log(min)
        this.searchService.search(params)
            .pipe(
                shareReplay(1),
                catchError(() => of({
                    data: [],
                    count: 0
                } as IProductResults)),
                finalize(() => this._loadingSubject.next(false))
            ).subscribe(data => {
                this._totalSubject.next(data.count);
                this._productsSubject.next(data.data);
            });
    }
}