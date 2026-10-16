export interface MachineTemperatureHistory{
    TemperatureHistoryId:number;
    MachineId:number;
    UserId:number;
    Temperature:number;
    RecordedAt:string;
}

export type MachineTemperatureHistoryRequest = Omit<MachineTemperatureHistory, 'TemperatureHistoryId'>;
