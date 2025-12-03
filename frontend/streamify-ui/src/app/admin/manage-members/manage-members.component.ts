import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Member {
  email: string;
  member_id: string;
  subscription_name: string;
  name: string;
}

@Component({
  selector: 'app-manage-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.scss']
})
export class ManageMembersComponent implements OnInit {
  members: Member[] = [];
  apiUrl = "/api/content"

  showAddForm = false;

  newMember = {
    email: "",
    password: "",
    name: "",
    street: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    subName: ""
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchMembers();
  }

  fetchMembers(): void {
    this.http.get<Member[]>(`${this.apiUrl}/members`)
      .subscribe(members => {
        this.members = members;
        this.cdr.detectChanges();
      });
  }

  addMember(): void {
    this.showAddForm = true;
    this.newMember = {
      email: '',
      password: '',
      name: '',
      street: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      subName: ''
    }
  }

  submitNewMember(): void {
    this.http.post(`${this.apiUrl}/member`, this.newMember, {
      responseType: 'text' as 'json'
    }).subscribe({next: () => {
      this.fetchMembers();
      this.showAddForm = false;},
    error: (err) => {
      console.log("failed to add member", err);}
    });
  }

  cancelNewMember(): void {
    this.showAddForm = false;
  }

  removeMember(member: Member): void {
    const body={
      email: member.email,
      member: member.member_id
    };

    this.http.delete(`${this.apiUrl}/member`, {
      body,
      responseType: 'text'
    }).subscribe({next: () =>{
      this.members = this.members.filter(m =>
        !(m.member_id === member.member_id && m.email === member.email));
      this.cdr.detectChanges();
      },
    error: (err) => {
      console.error("failed to delete member", err);
    }
    });
  }
}
