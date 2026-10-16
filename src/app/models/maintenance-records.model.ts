export interface MaintenanceRecords{
    maintenanceId:number;
    machineId:number;
    userId:number;
    machineName:string;
    responsible:string;
    maintenanceDate:string;
    maintenanceType:string;
    description:string;
    cost:number | null;
}

export interface MaintenanceRecordsRequest {
    UserId: number;
    MaintenanceDate: string;
    MaintenanceType: string;
    Description: string;
    Cost: number | null;
}
