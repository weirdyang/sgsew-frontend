import { Component, OnInit } from '@angular/core';
import { ThemingService } from 'src/app/services/core/theming.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  isDarkMode$ = this.themingService.darkMode$;

  constructor(private themingService: ThemingService) { }

  ngOnInit(): void {
    console.log('in');
  }

}
