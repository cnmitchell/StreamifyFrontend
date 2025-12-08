import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private member$$: BehaviorSubject<any | null>;
  public member$: Observable<any | null>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    this.member$$ = new BehaviorSubject<any | null>(this.getMember());
    this.member$ = this.member$$.asObservable();
  }

  setMember(member: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('member', JSON.stringify(member));
    }
    this.member$$.next(member);
  }

  getMember(): any | null {
    if (isPlatformBrowser(this.platformId)) {
      const member = localStorage.getItem('member');
      return member ? JSON.parse(member) : null;
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('member');
    }
    this.member$$.next(null);
  }

  updateUser(updateRequest: any): Observable<any> {
    return this.http.put('/api/content/user', updateRequest, { responseType: 'text' });
  }

  public refreshMemberState(updatedMember: any): void {
    const currentMember = this.getMember();
    const newMember = { ...currentMember, ...updatedMember };
    this.setMember(newMember);
  }
}
