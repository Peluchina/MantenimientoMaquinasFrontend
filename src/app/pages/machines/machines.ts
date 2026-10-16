import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MachinesService } from '../../services/machines.service';
import { apiErrorMessage } from '../../services/api-error-message';

@Component({
  selector: 'app-machines',
  imports: [ReactiveFormsModule],
  templateUrl: './machines.html',
  styleUrl: './machines.scss',
})
export class Machines {
  private readonly formBuilder = inject(FormBuilder);
  private readonly machinesService = inject(MachinesService);

  readonly machineForm = this.formBuilder.nonNullable.group({
    machineName: ['', [Validators.required, Validators.maxLength(100)]],
    Brand: ['', [Validators.required, Validators.maxLength(100)]],
    CurrentTemperature: [0, [Validators.required, Validators.min(0), Validators.max(9999.99)]],
    MaxTemperature: [100, [Validators.required, Validators.min(0.01), Validators.max(9999.99)]],
    LastMaintenanceDate: [''],
    MachineStatus: ['OPERATIVA', Validators.required],
  });

  isSaving = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.machineForm.invalid) {
      this.machineForm.markAllAsTouched();
      return;
    }

    const values = this.machineForm.getRawValue();
    this.isSaving = true;

    this.machinesService.create({
      MachineName: values.machineName,
      Brand: values.Brand,
      CurrentTemperature: values.CurrentTemperature,
      MaxTemperature: values.MaxTemperature,
      MachineStatus: values.MachineStatus,
      LastMaintenanceDate: values.LastMaintenanceDate
        ? new Date(values.LastMaintenanceDate).toISOString()
        : null,
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'La máquina se registró correctamente.';
        this.machineForm.reset({
          machineName: '',
          Brand: '',
          CurrentTemperature: 0,
          MaxTemperature: 100,
          LastMaintenanceDate: '',
          MachineStatus: 'OPERATIVA',
        });
      },
      error: (error: unknown) => {
        this.isSaving = false;
        this.errorMessage = apiErrorMessage(error, 'No se pudo registrar la máquina.');
      },
    });
  }

}
