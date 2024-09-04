import { Component, inject, signal, WritableSignal } from '@angular/core';
import { WishListService } from '../../core/services/wish-list.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IWishList } from '../../core/interfaces/iwish-list';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss',
})
export class WishListComponent {
  private readonly _WishListService = inject(WishListService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _CartService = inject(CartService);
  wishListSub!: Subscription;
  wishListDetails: WritableSignal<IWishList[]> = signal([]);

  ngOnInit(): void {
    this.loadWishList();
  }
  removeItem(id: string): void {
    this._WishListService.deleteSpecificWishListItem(id).subscribe({
      next: () => {
        this.loadWishList();
        this.updateWishlist();
      },
    });
  }
  addCart(id: string): void {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'Fresh Cart');
        this._CartService.cartNum.set(res.numOfCartItems);
        this.removeItem(id);
        this.updateWishlist();
      },
    });
  }

  private loadWishList(): void {
    this._WishListService.getProductToWishList().subscribe({
      next: (res) => {
        this.wishListDetails.set(res.data);
      },
    });
  }
  private updateWishlist(): void {
    const wishListArray = Array.from(
      this.wishListDetails().map((item) => item.id)
    );
    localStorage.setItem('wishlist', JSON.stringify(wishListArray));
  }
  ngOnDestroy(): void {
    this.wishListSub?.unsubscribe();
  }
}
