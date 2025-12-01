import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

  isLoadingMembers = false;
  hasRequestedMembers = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMovies()
  }

  loadMovies() {
    this.movies$ = this.http.get<Movie[]>(`${this.apiUrl}/all-content`);
  }

  onMovieChange() {
    this.loadMembersfor(this.selectedMovieId);
  }

  private loadMembersfor(movieId: string | null){
    if (!movieId){
      this.members = [];
      this.hasRequestedMembers = false;
      this.isLoadingMembers = false;
      this.cdr.markForCheck();
      return;
    }

    this.isLoadingMembers = true;
    this.hasRequestedMembers = true;
    this.members = [];

    const requestedId = movieId;

    this.http.get<Member[]>(`${this.apiUrl}/members-who-streamed?content_id=${requestedId}`)
      .subscribe({
        next: data => {
          if (this.selectedMovieId !== requestedId){
            console.log("ignored for", requestedId);
            return
          }
          this.members = data;
          this.isLoadingMembers = false;

          this.cdr.markForCheck();

        },
        error: error => {
          console.error(error);
          if (this.selectedMovieId === requestedId){
            this.isLoadingMembers = false;
          }
          this.cdr.markForCheck();
        }
      });
  }
}
