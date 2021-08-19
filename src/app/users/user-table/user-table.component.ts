import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteData } from 'src/app/shared/delete-dialog/delete-data';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { IUser, IUserDisplay } from 'src/app/types/user';
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

  user: IUser = this.authService.getUser() as IUser;

  displayedColumns = ['username', 'role', 'email', 'createdAt', 'delete'];
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {

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
  confirmDelete(user: IUserDisplay) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      propertyName: 'username',
      propertyValue: user.username,
      errorMessage: 'Names do not match.'
    } as DeleteData;

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.userService.deleteUser(user._id)
          .subscribe(
            {
              next: (data) => this.handleDelete(user),
              error: (message) => this.snackBar.open('Error deleting user', 'OK')
            }
          )
      }
    })
  };
  handleDelete(user: IUserDisplay) {
    this.dataSource.refreshData();
    this.snackBar.open(`${user.username} deleted`, 'OK')
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {

    this.dataSource = new UsersDataSource(this.userService);

  }
}
