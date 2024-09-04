import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { IProducts } from '../../core/interfaces/iproducts';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { WishListService } from '../../core/services/wish-list.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishListService = inject(WishListService);

  DetailsSub!: Subscription;
  detailsProduct: WritableSignal<IProducts> = signal<IProducts>(
    {} as IProducts
  );

  //detailsProduct: IProducts = {} as IProducts;
  // detailsProduct: IProducts | null = null;

  customProductImageSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    items: 1,
    nav: false,
  };
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (parsms) => {
        let id = parsms.get('id');
        console.log(this._ActivatedRoute);

        this._ProductsService.getSpecificProduct(id).subscribe({
          next: (res) => {
            this.detailsProduct.set(res.data);
          },
        });
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
      },
    });
  }

  ngOnDestroy(): void {
    this.DetailsSub?.unsubscribe();
  }
}
