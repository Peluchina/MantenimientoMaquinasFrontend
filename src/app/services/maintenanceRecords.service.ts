import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MaintenanceRecords, MaintenanceRecordsRequest } from "../models/maintenance-records.model";

@Injectable({
    providedIn: 'root',
  })

  export class MaintenanceRecordsService{
    private apiUrl = '/api/maintenanceRecords';
  constructor(private http: HttpClient) {}

  getAll(): Observable<MaintenanceRecords[]> {
    return this.http.get<MaintenanceRecords[]>(this.apiUrl);
  }

  create(maintenanceRecords: MaintenanceRecordsRequest): Observable<any> {
    return this.http.post(this.apiUrl, maintenanceRecords);
  }
}