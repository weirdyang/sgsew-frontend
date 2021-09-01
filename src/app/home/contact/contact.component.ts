import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NetlifyFormsService } from 'src/app/services/netlify-forms.service';
import { Feedback } from './feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnDestroy {
  name: any;
  email: any;
  phone: any;
  message: any;
  subscribe: any;
  loading: boolean = false;
  emailSent: boolean = false;
  emailFailed: boolean = false;
  constructor(private netlifyForms: NetlifyFormsService) { }

  private formStatusSub!: Subscription;

  sendContact(contactForm: NgForm) {
    if (
      contactForm.invalid
    ) {
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message,
      subscribe: this.subscribe
        ? "Subscribe to newsletter"
        : "Do not subscribe to newsletter",
    };

    const entry = {
      ...data,
    } as Feedback;

    this.formStatusSub = this.netlifyForms.submitFeedback(entry).subscribe(
      (res) => {
        this.loading = false;
        this.emailSent = true;
        setTimeout(() => {
          this.emailSent = false;
        }, 10000);
        contactForm.resetForm();
      },
      (err) => {
        this.loading = false;
        this.emailFailed = true;
        setTimeout(() => {
          this.emailFailed = false;
        }, 10000);
      }
    );
  }

  ngOnDestroy() {
    this.formStatusSub ? this.formStatusSub.unsubscribe() : null;
  }

}
