import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../core/services/orders.service';
import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrdersService = inject(OrdersService);

  OrdersSub!: Subscription;

  msgError: string = '';
  cartId: string | null = '';
  orders: FormGroup = this._FormBuilder.group({
    details: [null, [Validators.required, Validators.minLength(3)]],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^01[0125[0-9]{9}$/)],
    ],
    city: [null, [Validators.required]],
  });
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (parms) => {
        this.cartId = parms.get('id');
      },
    });
  }

  ordersSubmit(): void {
    if (this.orders.valid) {
      this._OrdersService.checkOut(this.cartId, this.orders.value).subscribe({
        next(res) {
          if (res.status === 'success') {
            window.open(res.session.url, '_self');
          }
        },

        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.massage;
          console.log(err);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.OrdersSub?.unsubscribe();
  }
}
