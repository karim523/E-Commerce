import { Component, inject, signal, WritableSignal } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { Ibrand } from '../../core/interfaces/ibrand';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent {
  private readonly _BrandsService = inject(BrandsService);
  brandsList: WritableSignal<Ibrand[]> = signal([]);

  brandsSub!: Subscription;
  ngOnInit(): void {
    this._BrandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
      },
    });
  }

  constructor(private modalService: NgbModal) {}

  openModal(content: any) {
    this.modalService.open(content);
  }
  ngOnDestroy(): void {
    this.brandsSub?.unsubscribe();
  }
}
