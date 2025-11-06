import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export interface Member {
  email: string;
  member_id: string;
  subscription_name: string;
  name: string; // Assuming name is part of the member data from the backend
}

@Component({
  selector: 'app-manage-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.scss']
})
export class ManageMembersComponent implements OnInit {
  members: Member[] = [];
  apiUrl = "/api/content"

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchMembers();
  }

  fetchMembers(): void {
    this.http.get<Member[]>(`${this.apiUrl}/members`)
      .subscribe(members => {
        this.members = members;
        this.cdr.detectChanges(); // Manually trigger change detection
      });
  }

  addMember(): void {
    // Logic to add a new member will be implemented here
    console.log('Add member clicked');
  }

  removeMember(member: Member): void {
    // Logic to remove a member will be implemented here
    console.log('Remove member:', member);
  }
}
