
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface AgentChatResponse {
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  chat(message: string): Observable<AgentChatResponse> {
    const token = this.auth.getAccessToken();

    if (!token) {
      return throwError(
        () => new Error(
          'No se encontró un token de sesión. Cierra sesión y vuelve a ingresar.',
        ),
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<AgentChatResponse>(
      '/api/agent/chat',
      { message },
      {
        headers
      },
    );
  }
}
