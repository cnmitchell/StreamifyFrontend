import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const member = this.authService.getMember();
    this.isAdmin = member?.isAdmin;
  }
}
