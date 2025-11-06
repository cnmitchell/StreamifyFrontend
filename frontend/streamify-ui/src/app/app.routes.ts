import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    children: [
      { path: 'browse', loadComponent: () => import('./browse/browse.component').then(m => m.BrowseComponent) },
      { path: 'admin/manage-members', loadComponent: () => import('./admin/manage-members/manage-members.component').then(m => m.ManageMembersComponent) },
    ]
  },
];
