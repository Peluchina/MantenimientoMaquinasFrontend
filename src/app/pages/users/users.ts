import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roles } from '../../models/roles.model';
import { RolesService } from '../../services/roles.service';
import { UsersService } from '../../services/users.service';
import { apiErrorMessage } from '../../services/api-error-message';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly rolesService = inject(RolesService);

  roles: Roles[] = [];
  isLoadingRoles = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  readonly userForm = this.formBuilder.nonNullable.group({
    RoleId: [0, [Validators.required, Validators.min(1)]],
    Username: ['', [Validators.required, Validators.maxLength(50)]],
    FirstName: ['', [Validators.required, Validators.maxLength(100)]],
    LastName: ['', [Validators.required, Validators.maxLength(100)]],
    Email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    Password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
  });

  ngOnInit(): void {
    this.rolesService.getAll().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.isLoadingRoles = false;
      },
      error: (error: unknown) => {
        this.isLoadingRoles = false;
        this.errorMessage = apiErrorMessage(error, 'No se pudieron cargar los roles.');
      },
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.usersService.create(this.userForm.getRawValue()).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'El usuario se registró correctamente.';
        this.userForm.reset({
          RoleId: 0,
          Username: '',
          FirstName: '',
          LastName: '',
          Email: '',
          Password: '',
        });
      },
      error: (error: unknown) => {
        this.isSaving = false;
        this.errorMessage = apiErrorMessage(error, 'No se pudo registrar el usuario.');
      },
    });
  }
}
