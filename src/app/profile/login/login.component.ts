import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { ThemingService } from 'src/app/services/core/theming.service';
import { UserService } from 'src/app/services/user.service';
import { IApiResponse, ILogin, IUser } from 'src/app/types/user';
import { RegisterComponent } from '../register/register.component';
import { IErrorMessage } from 'src/app/types/http-error';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user?: ILogin;
  form!: FormGroup;
  get password() {
    return this.form.get('password');
  }
  hide = true;
  isDarkSubscription = this.themingService.darkMode$
    .subscribe(
      isDark => {
        if (isDark) {
          this.overlay.getContainerElement().classList.remove('light');
        } else {
          this.overlay.getContainerElement().classList.add('light');
        }
      }
    )

  constructor(
    private snackBar: MatSnackBar,
    private overlay: OverlayContainer,
    private themingService: ThemingService,
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginComponent>) {
    this.user = {
      username: '',
      password: '',
    }
    this.form = this.fb.group({
      username: [this.user?.username, [Validators.required]],
      password: [this.user?.password, [Validators.required]]
    })
  }


  dismiss() {
    this.dialogRef.close();
  }

  submit() {
    this.authService.loginUser(this.form.value as ILogin)
      .subscribe({
        next: response => {
          this.authService.setUser(response);
          this.dialogRef.close();
        },
        error: err => {
          const { error } = err;

          let errorMessage = '';
          if (error.message) {
            errorMessage += error.message;
          }
          if (error.additionalInfo && error.additionalInfo.length) {
            error.additionalInfo.forEach((element: IErrorMessage) => {
              errorMessage += `\n${element.error}`;
            });
          }
          console.log(errorMessage, 'errorMessage');
          this.snackBar.open(errorMessage ?? 'This is unexpected, please contact support', 'OK')
        }
      })
  }
}

