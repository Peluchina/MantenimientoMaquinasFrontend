import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MachineTemperatureHistory, MachineTemperatureHistoryRequest } from "../models/machine-temperature-history.model";


@Injectable({
    providedIn: 'root',
  })

  export class MachineTemperatureHistoryService{
    private apiUrl = '/api/machines';
  constructor(private http: HttpClient) {}

  getAll(machineId: number): Observable<MachineTemperatureHistory[]> {
    return this.http.get<MachineTemperatureHistory[]>(`${this.apiUrl}/${machineId}/temperatures`);
  }

  create(machineId: number, machineTemperatureHistory: MachineTemperatureHistoryRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${machineId}/temperatures`, machineTemperatureHistory);
  }
}
