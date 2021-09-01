import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { InstantErrorStateMatcher } from 'src/app/products/helpers/price.validator';
import { NetlifyFormsService } from 'src/app/services/netlify-forms.service';
import { Feedback } from './feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @ViewChild('myForm', { static: false })
  myForm!: NgForm;

  contactForm = this.fb.group({

    name: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    message: ['', [Validators.required, Validators.minLength(30)]],
  });

  message = this.contactForm.get('message');
  email = this.contactForm.get('email');
  name = this.contactForm.get('name');
  messageMatcher = new InstantErrorStateMatcher();
  isSubmitting: boolean = false;
  constructor(
    private netlifyForms: NetlifyFormsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
  }
  requiredErrorMessage = 'This field is required.';
  onSubmit() {
    this.isSubmitting = true;
    this.netlifyForms.submitFeedback(this.contactForm.value).subscribe(
      () => {
        this.isSubmitting = false;
        this.contactForm.reset();
        this.myForm.resetForm();
        this.snackBar.open('Thank you for reaching out!', 'OK');
      },
      err => {
        this.isSubmitting = false;
        console.error(err);
        this.snackBar.open('Error submitting form!', 'OK', {
          duration: 5000
        });
      }
    );
  }
}
