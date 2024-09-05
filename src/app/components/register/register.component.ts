import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  registerSub!: Subscription;
  msgError: string = '';
  isLoading: boolean = false;
  msgSucces: boolean = false;

  registerForm: FormGroup = this._FormBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])[A-Za-z\d]{6,9}$/)]],
      rePassword: [null, []],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125[0-9]{9}$/)],
      ],
    },
    { validators: [this.confirmPassword] }
  );

  // registerForm: FormGroup = new FormGroup(
  //   {
  //     name: new FormControl(null, [
  //       Validators.required,
  //       Validators.minLength(3),
  //       Validators.maxLength(20),
  //     ]),
  //     email: new FormControl(null, [Validators.required, Validators.email]),
  //     password: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^\w{6,}$/),
  //     ]),
  //     rePassword: new FormControl(null, []),
  //     phone: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^01[0125[0-9]{9}$/),
  //     ]),
  //   },
  //   this.confirmPassword
  // );

  registerSubmit(): void {
    this.isLoading = true;
    if (this.registerForm.valid) {
      this.registerSub = this._AuthService
        .setRegisterForm(this.registerForm.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res.message == 'success') {
              setTimeout(() => {
                this.msgSucces = true;
                this._Router.navigate(['/login']);
              }, 600);
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
      this.registerForm.setErrors({ mismatch: true });
      this.registerForm.markAsTouched();
    }
  }
  confirmPassword(pass: AbstractControl) {
    if (pass.get('password')?.value === pass.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }
  ngOnDestroy(): void {
    this.registerSub?.unsubscribe();
  }
}
