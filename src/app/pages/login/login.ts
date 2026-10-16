import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface GoogleCredentialResponse {
  credential: string;
}

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements AfterViewInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild('googleButton') private googleButton?: ElementRef<HTMLElement>;

  googleLoading = false;
  googleError = '';
  readonly googleClientConfigured = Boolean(this.authService.googleClientId);

  ngAfterViewInit(): void {
    if (!this.authService.googleClientId || !this.googleButton) return;

    const renderButton = () => {
      this.authService.renderGoogleButton(this.googleButton!.nativeElement, (response) =>
        this.loginWithGoogle(response.credential),
      );
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if ((window as Window & { google?: unknown }).google) {
      renderButton();
    } else if (existingScript) {
      existingScript.addEventListener('load', renderButton, { once: true });
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = renderButton;
      script.onerror = () => (this.googleError = 'No se pudo cargar el acceso de Google.');
      document.head.appendChild(script);
    }
  }

  private loginWithGoogle(credential: string): void {
    this.googleLoading = true;
    this.googleError = '';
    this.authService.loginWithGoogleToken(credential).subscribe({
      next: () => {
        this.googleLoading = false;
        void this.router.navigate(['/machines']);
      },
      error: (error: {
        error?: { message?: string; detail?: string; title?: string };
        message?: string;
      }) => {
        this.googleLoading = false;
        this.googleError =
          error.error?.message ??
          error.error?.detail ??
          error.error?.title ??
          error.message ??
          'No se pudo iniciar sesión con Google. Inténtalo de nuevo.';
      },
    });
  }
}
