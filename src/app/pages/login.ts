import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);

  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(80)]],
    password: ['', [Validators.required, Validators.maxLength(120)]],
  });

  passwordVisible = false;
  submitted = false;

  submit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  }
}
