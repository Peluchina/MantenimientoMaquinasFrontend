import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MachineTemperatureHistory, MachineTemperatureHistoryRequest } from "../models/machine-temperature-history.model";


@Injectable({
    providedIn: 'root',
  })

  export class MachineTemperatureHistoryService{
    private apiUrl = '/api/MachineTemperatureHistory';
  constructor(private http: HttpClient) {}

  getAll(): Observable<MachineTemperatureHistory[]> {
    return this.http.get<MachineTemperatureHistory[]>(this.apiUrl);
  }

  create(machineTemperatureHistory: MachineTemperatureHistoryRequest): Observable<any> {
    return this.http.post(this.apiUrl, machineTemperatureHistory);
  }
}