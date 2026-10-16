export interface MaintenanceRecords{
    MaintenanceId:number;
    MachineId:number;
    UserId:number;
    MachineName:string;
    Responsible:string;
    MaintenanceDate:string;
    MaintenanceType:string;
    Description:string;
    Cost:number;
}
export type MaintenanceRecordsRequest = Omit<MaintenanceRecords, 'MaintenanceId'>;
