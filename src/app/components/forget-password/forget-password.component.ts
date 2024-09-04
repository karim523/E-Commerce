import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  step: number = 1;
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  ForgetPasswordSub!: Subscription;

  verifiyEmail: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  verifiyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\w{6}$/),
    ]),
  });
  resetPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\w{6,}$/),
    ]),
  });

  verifiysEmailSubmit(): void {
    let emailValue = this.verifiyEmail.get('email')?.value;
    this.resetPassword.get('email')?.patchValue(emailValue);
    this._AuthService.setVerifiyEmail(this.verifiyEmail.value).subscribe({
      next: (res) => {
        if (res.statusMsg === 'success') {
          this.step = 2;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  verifiyCodeSubmit(): void {
    this._AuthService.setVerifiyCode(this.verifiyCode.value).subscribe({
      next: (res) => {
        if (res.statusMsg === 'success') {
          this.step = 3;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  verifiyPasswordSubmit(): void {
    this._AuthService.setResetPassword(this.resetPassword.value).subscribe({
      next: (res) => {
        localStorage.setItem('userToken', res.toekn);
        this._Router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnDestroy(): void {
    this.ForgetPasswordSub?.unsubscribe();
  }
}
