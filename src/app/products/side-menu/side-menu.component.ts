import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemingService } from 'src/app/services/core/theming.service';
import { NavigationService } from '../../services/core/navigation.service'
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SideMenuComponent {
  @Input()
  active: boolean = false;

  @Input()
  isSmallScreen: boolean = false;

  isDark$ = this.themingService.darkMode$;

  constructor(private navigationService: NavigationService, private themingService: ThemingService) { }

  toggleMenu() {
    this.navigationService.setShowNav(!this.active);
  }

}
