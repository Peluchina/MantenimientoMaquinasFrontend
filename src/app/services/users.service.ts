import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Users, UsersRequest } from "../models/users.models";

@Injectable({
    providedIn: 'root',
  })

  export class UsersService{
    private apiUrl = '/api/Users';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Users[]> {
    return this.http.get<Users[]>(this.apiUrl);
  }

  create(users: UsersRequest): Observable<any> {
    return this.http.post(this.apiUrl, users);
  }

  update(userId: number, users: UsersRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, users);
  }

  patch(userId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/UserStatus`, {
    });
  }
  }
