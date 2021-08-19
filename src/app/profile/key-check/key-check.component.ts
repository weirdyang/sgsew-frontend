import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { ThemingService } from 'src/app/services/core/theming.service';


@Component({
  selector: 'app-key-check',
  templateUrl: './key-check.component.html',
  styleUrls: ['./key-check.component.scss']
})
export class KeyCheckComponent implements OnInit {
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
  form!: FormGroup;
  constructor(
    private snackBar: MatSnackBar,
    private overlay: OverlayContainer,
    private themingService: ThemingService,
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<KeyCheckComponent>) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      key: ['', [Validators.required]],
    })
  }
  cancel() {
    this.dialogRef.close(false);
  }
  submit() {
    if (this.form.get('key')) {
      const { key } = this.form.value;
      this.authService.checkKey(key)
        .subscribe(
          {
            next: (res) => {
              this.dialogRef.close(true)
            },
            error: (err) => {

              if (err.status === 403) {
                this.snackBar.open(err.error.message, 'OK')
              } else {
                this.snackBar.open('This is unexpected, please contact tech support', 'OK')
              }
            }
          }
        )
    }
  }
}
