import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AllordersService } from '../../core/services/allorders.service';
import { Iallorders } from '../../core/interfaces/iallorders';
import { jwtDecode } from 'jwt-decode';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent {
  private readonly _AllordersService = inject(AllordersService);
  detailsAllOrders: WritableSignal<Iallorders[]> = signal([]);

  ngOnInit(): void {
    this._AllordersService
      .getAllOrders(jwtDecode<any>(localStorage.getItem('userToken')!).id)
      .subscribe({
        next: (res) => {
          this.detailsAllOrders.set(res);
        },
      });
  }
}
