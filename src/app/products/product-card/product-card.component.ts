import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { ThemingService } from 'src/app/services/core/theming.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {

  isDarkMode$ = this.themingService.darkMode$;

  constructor(
    private themingService: ThemingService) { }

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

  @Output() deleteClicked = new EventEmitter();

  @Output() editClicked = new EventEmitter();

  editClick() {
    this.editClicked.emit(this.productId);
  }
  deleteClick() {
    this.deleteClicked.emit(this.productId);
  }

  get imageUrl() {
    if (!this.productId) {
      return 'assets/images/fish.jpg'
    }
    return `${environment.searchApi}/search/image/${this.productId}`
  }
}
