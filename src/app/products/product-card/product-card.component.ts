import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { ThemingService } from 'src/app/services/core/theming.service';
import { ProductsService } from 'src/app/services/products.service';
import { IHttpError } from 'src/app/types/http-error';
import { IUser } from 'src/app/types/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {

  isDarkMode$ = this.themingService.darkMode$;

  constructor(private themingService: ThemingService,
    private productService: ProductsService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  @Input()
  isService: boolean = false;
  @Input()
  name: string = 'Product name';
  @Input()
  brand: string = 'Product brand';
  @Input()
  description: string = 'Product description';
  @Input()
  productType: string = 'Product type';
  @Input()
  price: number = 0;

  @Input()
  productId: string = '';


  @Input()
  isAdmin: boolean = false;
  @Input()
  isUser: boolean = false;

  ngOnInit(): void {
    console.log(this.isUser);
  }

  get imageUrl() {
    if (!this.productId) {
      return 'assets/images/fish.jpg'
    }
    return `${environment.searchApi}/search/image/${this.productId}`
  }
  navigateAfterDelete(message: string) {
    if (message) {
      this.snackBar.open(message, 'OK')
    }
    this.router.navigateByUrl('/');
  }
  showError(error: IHttpError) {
    const message = error.message ?? 'This is unexpected, please contact support.';
    this.snackBar.open(message, 'OK');
    return EMPTY;
  }
  delete() {
    this.productService.deleteProduct(this.productId)
      .subscribe({
        next: (res) => this.navigateAfterDelete(res.message),
        error: (err) => this.showError(err.error)
      })
  }
}
