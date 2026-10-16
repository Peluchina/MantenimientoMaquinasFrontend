import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MaintenanceRecords, MaintenanceRecordsRequest } from "../models/maintenance-records.model";

@Injectable({
    providedIn: 'root',
  })

  export class MaintenanceRecordsService{
    private apiUrl = '/api/machines';
  constructor(private http: HttpClient) {}

  getAll(machineId: number): Observable<MaintenanceRecords[]> {
    return this.http.get<MaintenanceRecords[]>(`${this.apiUrl}/${machineId}/maintenance-records`);
  }

  create(machineId: number, maintenanceRecords: MaintenanceRecordsRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${machineId}/maintenance-records`, maintenanceRecords);
  }
}
