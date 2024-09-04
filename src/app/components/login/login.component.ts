import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  loginSub!: Subscription;
  msgError: string = '';
  isLoading: boolean = false;
  msgSucces: boolean = false;

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  });

  loginSubmit(): void {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.loginSub = this._AuthService
        .setLoginForm(this.loginForm.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res.message == 'success') {
              this.msgSucces = true;
              setTimeout(() => {
                localStorage.setItem('userToken', res.token);
                this._AuthService.saveUserData();
                this._Router.navigate(['/home']);
              }, 800);
            }

            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.msgError = err.error.massage;
            console.log(err);
            this.isLoading = false;
          },
        });
    } else {
      this.loginForm.setErrors({ mismatch: true });
      this.loginForm.markAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}
