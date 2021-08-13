import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _showNavSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  showNav$ = this._showNavSubject.asObservable();
  constructor(private router: Router) {
    // here any navigation events (i.e. clicking on the nav items to go to a separate page)
    // will be captured inside this subscription, then we hide the nav by setting
    // the showNav$ to false or in our case, calling the setShowNav to false, which does the same
    router.events.subscribe(() => {
      this.setShowNav(false);
    });
  }

  get isShown() {
    return this._showNavSubject.value;
  }

  setShowNav(showHide: boolean) {
    this._showNavSubject.next(showHide);
  }

  toggle() {
    console.log(!this.isShown);
    this._showNavSubject.next(!this.isShown);
  }
  toggleNavState(value: boolean) {
    this._showNavSubject.next(value);
  }

}