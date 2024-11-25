import { Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { filterData } from '../../core/utils/filter.utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddUserComponent } from "./add-user/add-user.component";
import { FeedbackService } from '../../core/services/feedback.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AddUserComponent
],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [UsersService]
})
export class UsersComponent {
  searchTerm: string = '';
  title: string = '';
  showDeleteModal: boolean = false;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  isEditing: boolean = false;
  headers: string[] = ['Usuario', 'Correo'];
  data: User[] = [];
  element: User | null = null;
  status: string = 'init';
  constructor(
    private readonly usersService: UsersService,
    private readonly feedbackService: FeedbackService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.status = 'loading';
    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        this.status = 'success';
        this.data = response.data;
      },
      error: (error) => {
        this.status = 'error';
        this.feedbackService.showError('Error al cargar usuarios');
      }
    });
  }

  get filteredData(): User[] | null {
    return filterData(this.data, this.searchTerm);
  }
  openAddUser() {
    this.showAddModal = !this.showAddModal;
    this.showEditModal = false;
    this.title = 'Agregar Usuario';
  }

  closeModalDelete() {
    this.showDeleteModal = false;
  }
}
