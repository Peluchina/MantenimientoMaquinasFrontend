import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Machines, MachinesRequest } from "../models/machines.model";

@Injectable({
    providedIn: 'root',
  })

  export class MachinesService{
    private apiUrl = '/api/Machines';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Machines[]> {
    return this.http.get<Machines[]>(this.apiUrl);
  }

  create(machine: MachinesRequest): Observable<any> {
    return this.http.post(this.apiUrl, machine);
  }

  update(machineId: number, machine: MachinesRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${machineId}`, machine);
  }

  delete(machineId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${machineId}/id`, {
    });
  }
  }