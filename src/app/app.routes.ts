import { Routes } from '@angular/router';
import { Machines } from './pages/machines/machines';
import { Users } from './pages/users/users';
import { MaintenanceRecords } from './pages/maintenance-records/maintenance-records';
import { MachineTemperatureHistory } from './pages/machine-temperature-history/machine-temperature-history';
import { Login } from './pages/login';

export const routes: Routes = [
  { path: '', redirectTo: 'machines', pathMatch: 'full' },
  { path: 'machines', component: Machines },
  { path: 'users', component: Users },
  { path: 'maintenance-records', component: MaintenanceRecords },
  { path: 'machine-temperature-history', component: MachineTemperatureHistory },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'machines' },
];
