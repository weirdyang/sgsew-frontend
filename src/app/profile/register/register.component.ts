import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnDestroy, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { avatars } from 'src/app/config';
import { AuthService } from 'src/app/services/auth.service';
import { ThemingService } from 'src/app/services/core/theming.service';
import { RegisterUser } from 'src/app/types/user';
import { passwordMatchValidator } from './password-match.validator';
import { createPasswordStrengthValidator } from './password.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IErrorMessage } from 'src/app/types/http-error';
import { shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// need to inject select module into root
//https://github.com/angular/angular/issues/35264
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  form!: FormGroup
  get password() {
    return this.form.get('password');
  }
  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }
  get email() {
    return this.form.get('email');
  }
  get username() {
    return this.form.get('username');
  }
  get avatar() {
    return this.form.get('avatar')?.value;
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

  isDark$ = this.themingService.darkMode$.pipe(shareReplay(1));
  avatars = avatars;
  user: RegisterUser = new RegisterUser();

  passwordChange$!: Subscription;
  constructor(
    private snackBar: MatSnackBar,
    private overlay: OverlayContainer,
    private themingService: ThemingService,
    private fb: FormBuilder,
    private authService: AuthService,
    @Optional() public dialogRef: MatDialogRef<RegisterComponent>) {

    this.form = this.fb.group({
      username: [
        {
          value: this.user.username,
          disabled: this.isSubmitting
        }, [Validators.required, Validators.minLength(6)]],
      email: [
        {
          value: this.user.email,
          disabled: this.isSubmitting
        }, {
          validators: [Validators.required, Validators.email],
          updateOn: 'blur'
        }],
      avatar: [
        {
          value: this.user.avatar,
          disabled: this.isSubmitting
        }, Validators.required],
      password: [
        {
          value: this.user.password,
          disabled: this.isSubmitting
        },
        [
          Validators.required,
          Validators.minLength(8),
          createPasswordStrengthValidator()
        ],

      ],
      passwordConfirm: [
        {
          value: '',
          disabled: this.isSubmitting
        },
        [Validators.required, passwordMatchValidator]
      ]
    });
    this.passwordChange$ = this.password?.valueChanges
      .subscribe(value => this.passwordConfirm?.updateValueAndValidity()) as Subscription;
  }
  ngOnDestroy(): void {
    this.isDarkSubscription.unsubscribe();
    this.passwordChange$?.unsubscribe();
  }

  isSubmitting = false;

  save() {
    this.isSubmitting = true;

    this.authService.registerUser(this.form.value as RegisterUser)
      .subscribe({
        next: result => {

          this.snackBar.open(result.message, 'OK');
          this.dialogRef.close();
        },
        error: err => {
          this.isSubmitting = false;
          const { error } = err;
          let errorMessage = '';
          if (error.additionalInfo && error.additionalInfo.length) {
            error.additionalInfo.forEach((element: IErrorMessage) => {
              errorMessage += `${element.error}. `;
            });
          }
          if (!errorMessage) {
            errorMessage = error.message;
          }
          this.snackBar.open(`${errorMessage}`, 'OK')
        }
      })
  }
  dismiss() {
    this.dialogRef.close();
  }
}
