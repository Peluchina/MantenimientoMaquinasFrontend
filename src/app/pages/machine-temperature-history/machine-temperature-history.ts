import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Machines as Machine } from '../../models/machines.model';
import { Users as User } from '../../models/users.models';
import { MachineTemperatureHistoryService } from '../../services/machine-temperature-history.service';
import { MachinesService } from '../../services/machines.service';
import { UsersService } from '../../services/users.service';
import { apiErrorMessage } from '../../services/api-error-message';

@Component({
  selector: 'app-machine-temperature-history',
  imports: [ReactiveFormsModule],
  templateUrl: './machine-temperature-history.html',
  styleUrl: './machine-temperature-history.scss',
})
export class MachineTemperatureHistory implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly machinesService = inject(MachinesService);
  private readonly usersService = inject(UsersService);
  private readonly historyService = inject(MachineTemperatureHistoryService);

  machines: Machine[] = [];
  users: User[] = [];
  isLoadingOptions = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  readonly historyForm = this.formBuilder.nonNullable.group({
    MachineId: [0, [Validators.required, Validators.min(1)]],
    UserId: [0, [Validators.required, Validators.min(1)]],
    Temperature: [0, [Validators.required, Validators.min(0), Validators.max(9999.99)]],
  });

  ngOnInit(): void {
    forkJoin({
      machines: this.machinesService.getAll(),
      users: this.usersService.getAll(),
    }).subscribe({
      next: ({ machines, users }) => {
        this.machines = machines;
        this.users = users.filter((user) => user.userStatus?.toUpperCase() === 'ACTIVO');
        this.isLoadingOptions = false;
      },
      error: (error: unknown) => {
        this.isLoadingOptions = false;
        this.errorMessage = apiErrorMessage(error, 'No se pudieron cargar las máquinas y los usuarios.');
      },
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.historyForm.invalid) {
      this.historyForm.markAllAsTouched();
      return;
    }

    const values = this.historyForm.getRawValue();
    this.isSaving = true;

    this.historyService.create(values.MachineId, {
      UserId: values.UserId,
      Temperature: values.Temperature,
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'La lectura de temperatura se registró correctamente.';
        this.historyForm.reset({
          MachineId: 0,
          UserId: 0,
          Temperature: 0,
        });
      },
      error: (error: unknown) => {
        this.isSaving = false;
        this.errorMessage = apiErrorMessage(error, 'No se pudo registrar la temperatura.');
      },
    });
  }

}
