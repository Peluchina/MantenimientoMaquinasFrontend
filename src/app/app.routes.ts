import { Routes } from '@angular/router';
import { Machines } from './pages/machines/machines';
import { Users } from './pages/users/users';
import { MaintenanceRecords } from './pages/maintenance-records/maintenance-records';
import { MachineTemperatureHistory } from './pages/machine-temperature-history/machine-temperature-history';
import { Login } from './pages/login/login';
import { Agent } from './pages/agent/agent';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'machines', pathMatch: 'full' },
  { path: 'machines', component: Machines, canActivate: [authGuard] },
  { path: 'users', component: Users, canActivate: [authGuard] },
  { path: 'maintenance-records', component: MaintenanceRecords, canActivate: [authGuard] },
  { path: 'machine-temperature-history', component: MachineTemperatureHistory, canActivate: [authGuard] },
  { path: 'agent', component: Agent, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'machines' },
];
