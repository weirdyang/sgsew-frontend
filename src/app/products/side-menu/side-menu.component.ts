import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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


  constructor(private navigationService: NavigationService) { }

  toggleMenu() {
    this.navigationService.setShowNav(!this.active);
  }

}
