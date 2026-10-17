import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).getAccessToken();
  const requestPath = new URL(
    request.url,
    typeof location === 'undefined' ? 'http://localhost' : location.origin,
  ).pathname;
  const isApiRequest = requestPath.startsWith('/api/');
  const hasAuthorization = request.headers.has('Authorization');

  const outgoingRequest = token && isApiRequest && !hasAuthorization
    ? request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : request;

  if (requestPath === '/api/agent/chat') {
    console.debug(
      '[AuthInterceptor] Authorization presente antes de enviar:',
      outgoingRequest.headers.has('Authorization'),
    );
  }

  return next(outgoingRequest);
};
