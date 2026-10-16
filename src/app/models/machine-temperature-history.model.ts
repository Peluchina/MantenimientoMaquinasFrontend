export interface MachineTemperatureHistory{
    temperatureHistoryId:number;
    machineId:number;
    userId:number | null;
    temperature:number;
    recordedAt:string;
}

export interface MachineTemperatureHistoryRequest {
  UserId: number | null;
  Temperature: number;
}
