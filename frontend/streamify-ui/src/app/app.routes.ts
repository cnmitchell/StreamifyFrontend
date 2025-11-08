import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    children: [
      { path: 'browse', loadComponent: () => import('./member/browse/browse.component').then(m => m.BrowseComponent) },
      { path: 'streaming-history', loadComponent: () => import('./member/streaming-history/streaming-history.component').then(m => m.StreamingHistoryComponent) },
      { path: 'account', loadComponent: () => import('./member/account/account.component').then(m => m.AccountComponent) },
      { path: 'admin/member-streams', loadComponent: () => import('./admin/member-streams/member-streams.component').then(m => m.MemberStreamsComponent) },
      { path: 'admin/streaming-trends', loadComponent: () => import('./admin/streaming-trends/streaming-trends.component').then(m => m.StreamingTrendsComponent) },
      { path: 'admin/manage-members', loadComponent: () => import('./admin/manage-members/manage-members.component').then(m => m.ManageMembersComponent) },
      { path: 'admin/manage-movies', loadComponent: () => import('./admin/manage-movies/manage-movies.component').then(m => m.ManageMoviesComponent) },
      { path: 'admin/top-ten', loadComponent: () => import('./admin/top-ten/top-ten.component').then(m => m.TopTenComponent) },

    ]
  },
];
