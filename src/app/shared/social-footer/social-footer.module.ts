import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialFooterComponent } from './social-footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    SocialFooterComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    SocialFooterComponent
  ]
})
export class SocialFooterModule { }
