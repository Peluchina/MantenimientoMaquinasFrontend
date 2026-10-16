import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Machines as Machine } from '../../models/machines.model';
import { Users as User } from '../../models/users.models';
import { MachinesService } from '../../services/machines.service';
import { MaintenanceRecordsService } from '../../services/maintenanceRecords.service';
import { UsersService } from '../../services/users.service';
import { apiErrorMessage } from '../../services/api-error-message';

@Component({
  selector: 'app-maintenance-records',
  imports: [ReactiveFormsModule],
  templateUrl: './maintenance-records.html',
  styleUrl: './maintenance-records.scss',
})
export class MaintenanceRecords implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly machinesService = inject(MachinesService);
  private readonly usersService = inject(UsersService);
  private readonly recordsService = inject(MaintenanceRecordsService);

  machines: Machine[] = [];
  users: User[] = [];
  isLoadingOptions = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  readonly recordForm = this.formBuilder.nonNullable.group({
    MachineId: [0, [Validators.required, Validators.min(1)]],
    UserId: [0, [Validators.required, Validators.min(1)]],
    MaintenanceDate: [this.getLocalDateTime(), Validators.required],
    MaintenanceType: ['', [Validators.required, Validators.maxLength(50)]],
    Description: ['', [Validators.required, Validators.maxLength(500)]],
    Cost: [0, [Validators.required, Validators.min(0)]],
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

    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    const values = this.recordForm.getRawValue();
    const machine = this.machines.find((item) => item.machineId === values.MachineId);
    const user = this.users.find((item) => item.userId === values.UserId);

    if (!machine || !user) {
      this.errorMessage = 'Selecciona una máquina y un responsable válidos.';
      return;
    }

    this.isSaving = true;
    this.recordsService.create(machine.machineId, {
      UserId: user.userId,
      MaintenanceType: values.MaintenanceType,
      Description: values.Description,
      Cost: values.Cost,
      MaintenanceDate: new Date(values.MaintenanceDate).toISOString(),
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'El registro de mantenimiento se guardó correctamente.';
        this.recordForm.reset({
          MachineId: 0,
          UserId: 0,
          MaintenanceDate: this.getLocalDateTime(),
          MaintenanceType: '',
          Description: '',
          Cost: 0,
        });
      },
      error: (error: unknown) => {
        this.isSaving = false;
        this.errorMessage = apiErrorMessage(error, 'No se pudo guardar el mantenimiento.');
      },
    });
  }

  private getLocalDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
}
