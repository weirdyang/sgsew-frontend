import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatSort, Sort } from "@angular/material/sort";
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject, Subscription } from "rxjs";
import { map, shareReplay, takeUntil, tap } from "rxjs/operators";
import { UserService } from "src/app/services/user.service";
import { IUser, IUserDisplay } from "src/app/types/user";

export class UsersDataSource implements DataSource<IUserDisplay> {
  private _sortSubject = new BehaviorSubject<Sort>(
    { active: 'userId', direction: 'desc' });
  sort!: MatSort;

  setSort(sort: Sort) {
    this._sortSubject.next(sort);
  }

  sort$ = this._sortSubject.asObservable()
    .pipe(shareReplay(1));

  private _refreshSubject = new BehaviorSubject<boolean>(true);
  refresh$ = this._refreshSubject.asObservable()
    .pipe(shareReplay(1));

  refreshData() {
    this.userService
      .getUsers()
      .subscribe(value =>
        this.userSubject.next(value.users));
  }
  constructor(private userService: UserService) {
    this.refreshData();
  }
  private userSubject = new BehaviorSubject<IUserDisplay[]>([]);

  users$ = this.userSubject.asObservable().pipe(shareReplay(1));

  protected readonly destroy$ = new Subject();
  connect(collectionViewer: CollectionViewer): Observable<readonly IUserDisplay[]> {
    if (this.sort) {
      return combineLatest([this.users$, this.sort$, this.refresh$])
        .pipe(
          takeUntil(this.destroy$),
          map(([value, sort, refresh]) => this.getSortedData(value)),
          tap(value => console.log(JSON.stringify(value)))
        );
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }

  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getSortedData(data: IUserDisplay[]): IUserDisplay[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id': return compare(+a._id, +b._id, isAsc);
        case 'username': return compare(a.username, b.username, isAsc)
        default: return compare(+a._id, +b._id, false)
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}