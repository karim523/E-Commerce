import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { Subscription } from 'rxjs';
import { SubcategoriesService } from '../../core/services/subcategories.service';
import { ISubCatgory } from '../../core/interfaces/isub-catgory';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _SubcategoriesService = inject(SubcategoriesService);
  categoriesList: WritableSignal<ICategory[]> = signal([]);
  subCategoriesList: WritableSignal<ISubCatgory[]> = signal([]);
  nameCat: string = '';
  categorySub!: Subscription;
  ngOnInit(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
    });
  }
  showSubCategory(id: string, nameCat: string): void {
    this.nameCat = nameCat;
    this._SubcategoriesService.getAllSubCategoriesOnCatgories(id).subscribe({
      next: (res) => {
        this.subCategoriesList.set(res.data);
      },
    });
  }
  ngOnDestroy(): void {
    this.categorySub?.unsubscribe();
  }
}
