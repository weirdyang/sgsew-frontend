import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemingService } from 'src/app/services/core/theming.service';
import { UserService } from 'src/app/services/user.service';
import { IUserDisplay } from 'src/app/types/user';
import { UsersDataSource } from './users.datasource';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource!: UsersDataSource;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IUserDisplay>;

  displayedColumns = ['userId', 'username', 'role', 'email', 'createdAt', 'delete'];
  constructor(
    private userService: UserService,
    private themingService: ThemingService) {

  }
  protected readonly destroy$ = new Subject();
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
    this.sort.sortChange.
      pipe(
        takeUntil(this.destroy$),
      ).
      subscribe(va => this.dataSource.setSort(va));

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {

    this.dataSource = new UsersDataSource(this.userService);

  }
}
