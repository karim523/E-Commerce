import { CurrencyPipe, NgStyle } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { ICategory } from '../../core/interfaces/icategory';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { CategoriesService } from '../../core/services/categories.service';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselModule,
    RouterLink,
    SearchPipe,
    FormsModule,
    CurrencyPipe,
    NgStyle,
    ProductComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly _CategoriesService = inject(CategoriesService);

  categoriesList: WritableSignal<ICategory[]> = signal([]);
  homeSub!: Subscription;

  text: string = '';
  carouselSrc: string[] = [
    './assets/images/XCM_Manual_1396328_4379574_Egypt_EG_BAU_GW_DC_SL_Jewelry_379x304_1X._SY304_CB650636675_.jpg',
    './assets/images/41nN4nvKaAL._AC_SY200_.jpg',
    './assets/images/61cSNgtEISL._AC_SY200_.jpg',
  ];
  photosList: string[] = [
    './assets/images/XCM_Manual_1396328_4379575_Egypt_EG_BAU_GW_DC_SL_Bags_Wallets_379x304_1X._SY304_CB650636675_.jpg',
    './assets/images/XCM_Manual_1533480_5305769_379x304_1X._SY304_CB616236518_.jpg',
  ];
  customOptionsMainSlider: OwlOptions = {
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
    nav: true,
  };

  customOptionsCategories: OwlOptions = {
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
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 4,
      },
      940: {
        items: 5,
      },
    },
    nav: true,
  };
  ngOnInit(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
    });
  }

  ngOnDestroy(): void {
    this.homeSub?.unsubscribe();
  }
}
