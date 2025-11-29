import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';

export interface Movie{
  content_id: string;
  content_name: string;
}

export interface Member{
  member_id: string;
  name: string;
  email: string;
  timestamp: string;
}


@Component({
  selector: 'app-member-streams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-streams.component.html',
  styleUrls: ['./member-streams.component.scss']
})


export class MemberStreamsComponent implements OnInit {

  apiUrl = '/api/content';

  movies$: Observable<Movie[]> | undefined;
  members: Member[] = [];
  selectedMovieId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMovies()
  }

  loadMovies() {
    this.movies$ = this.http.get<Movie[]>(`${this.apiUrl}/all-content`);
  }
  loadMembers() {
    if(!this.selectedMovieId) return;

    this.http.get<Member[]>(`${this.apiUrl}/members-who-streamed?content_id=${this.selectedMovieId}`)
    .subscribe(data => {
      this.members = data;
      console.log("loading members");
    });
  }
}
