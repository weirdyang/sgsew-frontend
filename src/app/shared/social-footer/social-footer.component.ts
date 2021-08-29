import { Component, OnInit } from '@angular/core';
import { faTwitter, faGithub, faYoutube, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-social-footer',
  templateUrl: './social-footer.component.html',
  styleUrls: ['./social-footer.component.scss']
})
export class SocialFooterComponent {

  constructor() { }
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faYoutube = faYoutube;
  faLinkedIn = faLinkedin;
  faGithub = faGithub;
}
