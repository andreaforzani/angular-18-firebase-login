import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  isFormSubmitted = false;

  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      passwordResetEmail: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]
      ],
    });
  }

  get passwordResetEmail() { return this.forgotPasswordForm.get('passwordResetEmail'); }

  forgotPassword() {
    this.isFormSubmitted = true;
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.passwordResetEmail!.value);
    }
  }
}
