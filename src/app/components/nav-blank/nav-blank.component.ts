import { subscribe } from 'diagnostics_channel';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { log } from 'console';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss',
})
export class NavBlankComponent {
  readonly _AuthService = inject(AuthService);
  private readonly _CartService = inject(CartService);
  countNumb:Signal<number> = computed(() => this._CartService.cartNum());

  ngOnInit(): void {
    this._CartService.getProductToCart().subscribe({
      next: (res) => {
        this._CartService.cartNum.set(res.numOfCartItems);
      },
    });
  }
}
