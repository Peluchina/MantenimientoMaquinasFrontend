import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;

  if (error.status === 0) {
    return 'No se pudo conectar con la API. Comprueba que MantenimientoMaquinasAPI esté ejecutándose.';
  }

  const body = error.error as {
    detail?: unknown;
    title?: unknown;
    errors?: Record<string, unknown>;
  } | null;

  const validationMessages = Object.values(body?.errors ?? {}).flatMap((value) =>
    Array.isArray(value) ? value : [value],
  ).filter((value): value is string => typeof value === 'string');

  if (validationMessages.length > 0) return validationMessages.join(' ');
  if (typeof body?.detail === 'string' && body.detail.trim()) return body.detail;
  if (typeof body?.title === 'string' && body.title.trim()) return body.title;

  return `${fallback} (HTTP ${error.status}).`;
}
