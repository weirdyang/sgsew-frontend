import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HandsetService implements OnDestroy {
  protected readonly destroy$ = new Subject();

  constructor(public breakpointObserver: BreakpointObserver) {

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  isScreenSmall$ = this.breakpointObserver.observe([
    "(max-width: 768px)",
  ]).pipe(
    map(result => result.matches),
    takeUntil(this.destroy$),
    shareReplay(1),
  )
}


