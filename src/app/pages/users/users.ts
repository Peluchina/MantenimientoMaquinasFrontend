import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usersService = inject(UsersService);

  readonly userForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    LastName: ['', [Validators.required, Validators.maxLength(80)]],
    username: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    roleId: [1, [Validators.required, Validators.min(1)]],
    RoleName: ['', [Validators.required, Validators.maxLength(60)]],
    userStatus: ['Activo', Validators.required],
  });

  isSaving = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.usersService.create({
      ...this.userForm.getRawValue(),
      CreatedAt: new Date().toISOString(),
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'El usuario se registró correctamente.';
        this.userForm.reset({
          firstName: '',
          LastName: '',
          username: '',
          email: '',
          roleId: 1,
          RoleName: '',
          userStatus: 'Activo',
        });
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'No se pudo registrar el usuario. Inténtalo nuevamente.';
      },
    });
  }
}
