import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ICart } from '../../core/interfaces/icart';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly _CartService = inject(CartService);

  cartDetails: WritableSignal<ICart> = signal<ICart>({} as ICart);

  cartSub!: Subscription;

  ngOnInit(): void {
    this._CartService.getProductToCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
      },
    });
  }

  removeItem(id: string): void {
    this._CartService.deleteSpecificCartItem(id).subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this._CartService.cartNum.set(res.numOfCartItems);
      },
    });
  }

  updateCount(id: string, newCount: number): void {
    if (newCount > 0) {
      this._CartService.updateProductQuantity(id, newCount).subscribe({
        next: (res) => {
          this.cartDetails.set(res.data);
          this._CartService.cartNum.set(res.numOfCartItems);
        },
      });
    }
  }
  clearItems(): void {
    this._CartService.clearCart().subscribe({
      next: (res) => {
        if (res.message == 'success') {
          this.cartDetails.set({} as ICart);
          this._CartService.cartNum.set(0);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }
}
