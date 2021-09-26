import { Component, OnInit } from '@angular/core';
import { ThemingService } from 'src/app/services/core/theming.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'rotateY(179deg)',
        })
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
        })
      ),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in')),
    ]),
  ],
})
export class AboutComponent implements OnInit {
  isDarkMode$ = this.themingService.darkMode$;

  constructor(private themingService: ThemingService) {}
  name = 'Logo';
  darklogo = 'assets/images/Logo-Dark.png'; //default_value
  lightlogo = 'assets/images/Logo-Light.png';
  status = false;

  updateLogo() {
    this.status = !this.status;
    if (this.status)
      //active status
      this.darklogo = 'assets/images/Logo-Dark.png';
    else this.darklogo = 'assets/images/word-puzzle-dark.png';

    if (this.status) this.lightlogo = 'assets/images/Logo-Light.png';
    else this.lightlogo = 'assets/images/word-puzzle.png';
  }

  ngOnInit() {}

  flip1: string = 'inactive';
  flip2: string = 'inactive';
  flip3: string = 'inactive';

  toggleFlip1() {
    this.flip1 = this.flip1 == 'inactive' ? 'active' : 'inactive';
  }
  toggleFlip2() {
    this.flip2 = this.flip2 == 'inactive' ? 'active' : 'inactive';
  }
  toggleFlip3() {
    this.flip3 = this.flip3 == 'inactive' ? 'active' : 'inactive';
  }
}
