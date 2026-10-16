export interface Machines {
  machineId: number;
  machineName: string;
  brand: string;
  currentTemperature: number;
  maxTemperature: number;
  lastMaintenanceDate: string | null;
  machineStatus: string;
}

export interface MachinesRequest {
  MachineName: string;
  Brand: string;
  CurrentTemperature: number;
  MaxTemperature: number;
  MachineStatus: string;
  LastMaintenanceDate: string | null;
}
