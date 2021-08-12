import { HttpParams } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';
import { IProductResults } from 'src/app/types/product';

@Component({
  selector: 'app-product-card-shell',
  templateUrl: './product-card-shell.component.html',
  styleUrls: ['./product-card-shell.component.scss']
})
export class ProductCardShellComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBarModule,
    private searchService: SearchService,
    private authService: AuthService
  ) { }
  sortOptions = ['nameasc', 'namedesc', 'brandasc', 'nameasc']
  searchParams = {
    keyword: '',
    sort: 'nameasc',
    type: '',
    skip: 0,
    limit: 12,
    min: 0,
    max: Number.MAX_SAFE_INTEGER
  }
  user = this.authService.getUser();

  private productSubject = new BehaviorSubject<IProductResults | null>(null)
  products$ = this.productSubject.asObservable()
    .pipe(
      shareReplay(1)
    )
  ngOnInit(): void {
    this.searchService.search(new HttpParams())
      .subscribe(
        value => this.productSubject.next(value)
      );
  }
}
