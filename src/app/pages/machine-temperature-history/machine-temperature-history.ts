import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Machines as Machine } from '../../models/machines.model';
import { Users as User } from '../../models/users.models';
import { MachineTemperatureHistoryService } from '../../services/machine-temperature-history.service';
import { MachinesService } from '../../services/machines.service';
import { UsersService } from '../../services/users.service';

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
    Temperature: [0, [Validators.required, Validators.min(-100), Validators.max(500)]],
    RecordedAt: [this.getLocalDateTime(), Validators.required],
  });

  ngOnInit(): void {
    forkJoin({
      machines: this.machinesService.getAll(),
      users: this.usersService.getAll(),
    }).subscribe({
      next: ({ machines, users }) => {
        this.machines = machines;
        this.users = users;
        this.isLoadingOptions = false;
      },
      error: () => {
        this.isLoadingOptions = false;
        this.errorMessage = 'No se pudieron cargar las máquinas y los usuarios.';
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

    this.historyService.create({
      ...values,
      RecordedAt: new Date(values.RecordedAt).toISOString(),
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'La lectura de temperatura se registró correctamente.';
        this.historyForm.reset({
          MachineId: 0,
          UserId: 0,
          Temperature: 0,
          RecordedAt: this.getLocalDateTime(),
        });
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'No se pudo registrar la temperatura. Inténtalo nuevamente.';
      },
    });
  }

  private getLocalDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
}
