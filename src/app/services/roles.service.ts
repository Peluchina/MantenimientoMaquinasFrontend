import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Roles } from "../models/roles.model";

@Injectable({
    providedIn: 'root',
  })

  export class RolesService{
    private apiUrl = '/api/Roles';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.apiUrl);
  }
}