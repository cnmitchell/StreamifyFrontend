import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  hide = true;
  loading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  toggleHide(): void {
    this.hide = !this.hide;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Form is invalid:', this.form.errors);
      return;
    }
    this.loading = true;
    this.loginError = '';
    const payload = this.form.value;

    this.http.post('/api/content/login', payload, { responseType: 'json' }).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful', response);
        this.authService.setMember(response);
        this.router.navigate(['/home/browse']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.loginError = 'Invalid credentials';
        } else {
          this.loginError = 'An unexpected error occurred. Please try again.';
        }
        console.error('Login failed', err);
        this.cdr.detectChanges();
      }
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
