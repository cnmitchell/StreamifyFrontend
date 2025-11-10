import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private email$$ = new BehaviorSubject<string | null>(null);
  email$ = this.email$$.asObservable();

  constructor() {
  }

  setEmail(email: string | null) {
    this.email$$.next(email);
  }
}
