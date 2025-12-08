import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  member: any;
  editableMember: any;
  isEditMode = false;
  isLoading = false;
  passwordChange = {
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.authService.member$.subscribe(member => {
      this.member = member;
      this.editableMember = { ...member };
    });
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEditMode(): void {
    this.isEditMode = false;
    this.editableMember = { ...this.member };
    this.passwordChange = { newPassword: '', confirmPassword: '' };
  }

  submitChanges(): void {
    this.isLoading = true;
    const { name, email, street, city, state, country, phone, subscription_name } = this.editableMember;
    const updateUserRequest: any = {
      id: this.member.id,
      name,
      email,
      street,
      city,
      state,
      country,
      phone,
      subName: subscription_name
    };

    if (this.passwordChange.newPassword) {
      if (this.passwordChange.newPassword !== this.passwordChange.confirmPassword) {
        alert("New passwords do not match.");
        this.isLoading = false;
        return;
      }
      updateUserRequest.password = this.passwordChange.newPassword;
    }
    console.log('updateUserRequest', updateUserRequest);

    this.authService.updateUser(updateUserRequest).subscribe({
      next: () => {
        this.authService.refreshMemberState(updateUserRequest);
        if (isPlatformBrowser(this.platformId)) {
          window.location.reload();
        }
      },
      error: (error) => {
        console.error('Error updating user', error);
        alert(error.error?.message || 'Failed to update user.');
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
