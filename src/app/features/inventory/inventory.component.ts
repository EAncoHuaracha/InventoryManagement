import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { filterData } from '../../core/utils/filter.utils';
import { Product } from '../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from "./add-product/add-product.component";
import { InventoryService } from '../../core/services/inventory.service';
import { HttpClientModule } from '@angular/common/http';
import { FeedbackService } from '../../core/services/feedback.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddProductComponent,
    HttpClientModule
],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
  providers: [InventoryService]
})
export class InventoryComponent {

  searchTerm: string = '';
  title: string = '';
  showDeleteModal: boolean = false;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  isEditing: boolean = false;
  headers: string[] = ['Código', 'Nombre', 'Descripción', 'Cantidad', 'Precio Unitario', 'Categoría', 'Acciones'];
  data: Product[] = [];
  element: Product | null = null;

  status: string = 'init';
  constructor(
    private readonly router: Router,
    private readonly inventoryService: InventoryService,
    private readonly feedbackService: FeedbackService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.status = 'loading';
    this.inventoryService.getProducts().subscribe({
      next: (response) => {
        this.status = 'success';
        this.data = response.data;
      },
      error: (error) => {
        this.status = 'error';
        this.feedbackService.showError('Error al cargar productos');
        console.error('Error al cargar productos:', error);
      }
    });
  }


  get filteredData(): Product[] | null {
    return filterData(this.data, this.searchTerm);
  }
  openAddProduct() {
    this.showAddModal = !this.showAddModal;
    this.showEditModal = false;
    this.title = 'Agregar Producto';
  }

  openViewProduct(element: Product) {
    this.showEditModal = !this.showEditModal;
    this.showAddModal = false;
    this.title = 'Detalle del Producto';
    this.element = element;
    this.isEditing = true;
  }

  openModalDelete() {
    this.showDeleteModal = true;
  }

  closeModalDelete() {
    this.showDeleteModal = false;
    this.loadData();
  }
}
