import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserInterface } from '../../models/user.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  user: UserInterface;
  constructor(public authService: AuthService) {
    this.user = authService.userData;
  }

  sendVerificationMail() {
    this.authService.sendVerificationMail();
  }
}
