import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface AuthenticatedUser {
  userId: number;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  roleId?: number;
  roleName?: string;
  token: string;
  picture?: string | null;
  expiresAt?: string;
}

interface GoogleLoginResponse extends Partial<AuthenticatedUser> {
  accessToken?: string;
  access_token?: string;
  jwt?: string;
  jwtToken?: string;
  user?: Partial<AuthenticatedUser> & Record<string, unknown>;
  data?: GoogleLoginResponse | (Partial<AuthenticatedUser> & Record<string, unknown>);
  [key: string]: unknown;
}

interface GoogleIdentityApi {
  accounts: {
    id: {
      initialize(options: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }): void;
      renderButton(element: HTMLElement, options: Record<string, string | number>): void;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/Auth';
  private readonly storageKey = 'mantenimiento_user';

  // El Client ID es público. No pongas aquí el Client Secret.
  public googleClientId = '1057775251532-dbuepkgvg50v6462naiarb8lqbjj2vr0.apps.googleusercontent.com';

  readonly currentUser = signal<AuthenticatedUser | null>(this.getStoredUser());

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  }

  getAccessToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  getUserRole(): string {
    const user = this.currentUser();
    if (!user) return '';

    const role = user.role || user.roleName || String(user.roleId || '') || this.getRoleFromToken(user.token);
    const normalized = role.toUpperCase().trim();
    if (normalized.includes('ADMINISTRATIVO')) return 'ADMINISTRATIVO';
    if (normalized.includes('ADMIN')) return 'ADMIN';
    return normalized;
  }

  hasRole(allowedRoles: string[]): boolean {
    return allowedRoles.map((role) => role.toUpperCase()).includes(this.getUserRole());
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isRecepcionista(): boolean {
    return this.getUserRole() === 'RECEPCIONISTA';
  }

  loginWithGoogleToken(credential: string): Observable<AuthenticatedUser> {
    return this.http
      .post<GoogleLoginResponse>(`${this.apiUrl}/google-login`, { idToken: credential })
      .pipe(
        map((response) => {
          const nested = this.asRecord(response.data);
          const apiUser = this.asRecord(response.user) ?? this.asRecord(nested?.['user']) ?? nested ?? response;
          const token =
            response.token ?? response.accessToken ?? response.access_token ?? response.jwt ??
            response.jwtToken ?? nested?.['token'] ?? nested?.['accessToken'] ?? nested?.['access_token'] ??
            apiUser['token'] ?? apiUser['accessToken'] ?? apiUser['access_token'] ?? apiUser['jwt'] ?? apiUser['jwtToken'];

          if (typeof token !== 'string' || !token) {
            throw new Error('La respuesta del API no contiene un token de sesión.');
          }

          const user = { ...apiUser, token } as AuthenticatedUser;
          this.setSession(user);
          return user;
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
  }

  renderGoogleButton(
    element: HTMLElement,
    handleCredentialResponse: (response: { credential: string }) => void,
  ): void {
    const google = (window as Window & { google?: GoogleIdentityApi }).google;
    if (!google || !this.googleClientId) return;

    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 350,
      locale: 'es',
    });
  }

  private getStoredUser(): AuthenticatedUser | null {
    if (typeof localStorage === 'undefined') return null;
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return null;
    try {
      const user = JSON.parse(saved) as Partial<AuthenticatedUser>;
      return typeof user.token === 'string' && user.token
        ? (user as AuthenticatedUser)
        : null;
    } catch {
      return null;
    }
  }

  private setSession(user: AuthenticatedUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getRoleFromToken(token: string): string {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return '';
      const payload = JSON.parse(atob(parts[1]));
      return (
        payload.role ||
        payload.roles ||
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        ''
      );
    } catch {
      return '';
    }
  }

  private asRecord(value: unknown): Record<string, any> | null {
    return value !== null && typeof value === 'object' ? (value as Record<string, any>) : null;
  }
}
