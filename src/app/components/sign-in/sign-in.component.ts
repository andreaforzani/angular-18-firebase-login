import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  signInForm: FormGroup;
  isFormSubmitted = false;
  hasErrors = false;
  errorMessage = "";

  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.signInForm = this.fb.group({
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

  get userEmail() { return this.signInForm.get('userEmail'); }
  get userPassword() { return this.signInForm.get('userPassword'); }

  signIn() {
    // console.log(this.signInForm.controls['userEmail'].errors);
    this.isFormSubmitted = true;
    if (this.signInForm.valid) {
      this.authService.signIn(this.userEmail!.value, this.userPassword!.value).then((response) => {
        // console.log(response);
        this.errorMessage = "";
        this.hasErrors = false;
      }).catch((error) => {
        // console.log(error);
        this.errorMessage = error.message;
        this.hasErrors = true;
      });
    }
  }

  googleSignIn() {
    this.authService.googleAuth().then((response) => {
      this.errorMessage = "";
      this.hasErrors = false;
    }).catch((error) => {
      window.alert(error.message);
      this.errorMessage = error.message;
      this.hasErrors = true;
    });
  }
}
