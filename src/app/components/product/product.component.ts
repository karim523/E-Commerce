import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProducts } from '../../core/interfaces/iproducts';
import { Subscription } from 'rxjs';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { WishListService } from '../../core/services/wish-list.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    RouterLink,
    SearchPipe,
    FormsModule,
    CurrencyPipe,
    NgClass,
    NgStyle,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _WishListService = inject(WishListService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _CartService = inject(CartService);

  private wishlist = new Set<number>();

  productsList: WritableSignal<IProducts[]> = signal([]);
  productSub!: Subscription;
  text: string = '';
  wish: boolean = false;

  ngOnInit(): void {
    this.productSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.loadWishlist();
      },
    });
  }

  addCart(id: string): void {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'Fresh Cart');
        this._CartService.cartNum.set(res.numOfCartItems);
      },
    });
  }

  addWishList(id: string): void {
    this._WishListService.addProductToWishList(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'Fresh Cart');
        this.wish = true;
      },
    });
  }


  toggleWishList(productId: number) {
    if (this.wishlist.has(productId)) {
      this.wishlist.delete(productId);
    } else {
      this.wishlist.add(productId);
    }
    localStorage.setItem('wishlist', JSON.stringify(Array.from(this.wishlist)));
  }
  isActive(productId: number): boolean {
    return this.wishlist.has(productId);
  }
  private loadWishlist(): void {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlist = new Set<number>(JSON.parse(storedWishlist));
    }
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
  }
}
