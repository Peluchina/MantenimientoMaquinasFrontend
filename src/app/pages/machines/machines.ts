import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MachinesService } from '../../services/machines.service';

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
    Brand: ['', [Validators.required, Validators.maxLength(80)]],
    CurrentTemperature: [0, [Validators.required, Validators.min(-100), Validators.max(500)]],
    MaxTemperature: [100, [Validators.required, Validators.min(-100), Validators.max(500)]],
    DateTime: [this.getLocalDateTime(), Validators.required],
    MachineStatus: ['Operativa', Validators.required],
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
      ...values,
      DateTime: new Date(values.DateTime).toISOString(),
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'La máquina se registró correctamente.';
        this.machineForm.reset({
          machineName: '',
          Brand: '',
          CurrentTemperature: 0,
          MaxTemperature: 100,
          DateTime: this.getLocalDateTime(),
          MachineStatus: 'Operativa',
        });
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'No se pudo registrar la máquina. Inténtalo nuevamente.';
      },
    });
  }

  private getLocalDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
}
