import { Component, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    this.loading = true;

    this.auth
      .login(this.email.trim(), this.password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin').catch(() => {
            this.error = 'No se pudo acceder al panel (ruta inexistente o bloqueada).';
            if (isDevMode()) console.error('Navigation to /admin failed');
          });
        },
        error: (err: HttpErrorResponse) => {
          this.error =
            err?.error?.message ||
            err?.message ||
            'Credenciales incorrectas o error inesperado';
        },
      });
  }
}