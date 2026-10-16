export interface Machines{
    machineId:number;
    machineName: string;
    Brand: string;
    CurrentTemperature: number;
    MaxTemperature: number;
    DateTime: string;
    MachineStatus:string;
}

export type MachinesRequest = Omit<Machines, 'machineId'>;