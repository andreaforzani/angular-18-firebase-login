import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  signUpForm: FormGroup;
  isFormSubmitted = false;
  hasErrors = false;
  errorMessage = "";

  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      userEmail: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]
      ],
      userPassword: ['', Validators.required],
    });
  }

  get userEmail() { return this.signUpForm.get('userEmail'); }
  get userPassword() { return this.signUpForm.get('userPassword'); }

  signUp() {
    this.isFormSubmitted = true;
    if (this.signUpForm.valid) {
      this.authService.signUp(this.userEmail!.value, this.userPassword!.value).then((response) => {
        // console.log('signUp response: ' + response);
        this.authService.sendVerificationMail();
        this.authService.setUserData(response.user);
        this.errorMessage = "";
        this.hasErrors = false;
      }).catch((error) => {
        window.alert(error.message);
        this.errorMessage = error.message;
        this.hasErrors = true;
      });
    }
  }

  googleSignUp() {
    this.authService.googleAuth().then((response) => {
      // console.log('googleAuth response: ' + response);
      this.authService.setUserData(response.user);
      this.errorMessage = "";
      this.hasErrors = false;
    }).catch((error) => {
      window.alert(error.message);
      this.errorMessage = error.message;
      this.hasErrors = true;
    });
  }
}
