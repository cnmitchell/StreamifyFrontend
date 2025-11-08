import {Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Movie} from '../../browse/browse.component';


@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-movies.component.html',
  styleUrls: ['./manage-movies.component.scss']

})
export class ManageMoviesComponent implements OnInit {

  movies: Movie[] = [];
  newMovie: any = { title: "", genre: "", director: "", cast: "", awards: [] };
  selectedMovie: any = null;
  apiUrl = "/api/content"

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    console.log('Starting fetchMovies');
    try {
      let params = new HttpParams();

      console.log(`Making request to ${this.apiUrl}/browse/movies with params: ${params.toString()}`);
      this.http.get<Movie[]>(`${this.apiUrl}/browse/movies`, { params })
        .subscribe({
          next: movies => {
            this.movies = movies;
            this.cdr.detectChanges();
            console.log('Successfully fetched and updated movies.');
          },
          error: err => {
            console.error('Error fetching movies:', err);
          }
        });
    } catch (e) {
      console.error('An unexpected error occurred in fetchMovies:', e);
    }
  }

  addMovie(): void {
    this.http.get<any[]>(`${this.apiUrl}/admin/movies`, this.newMovie)
      .subscribe(data => {
        this.newMovie = data;
      });
  }

  startEditMovie(movie: any): void {
    this.selectedMovie = { ...movie };
  }

  saveEditMovie(): void {
    if (!this.selectedMovie) return;

    this.http.put(`${this.apiUrl}/admin/movies/${this.selectedMovie.id}`, this.selectedMovie)
      .subscribe(data => {
        this.selectedMovie = null;
        this.loadMovies();
      });
  }

  deleteMovie(id: string): void {
    this.http.delete(`${this.apiUrl}/admin/movies/${id}`)
      .subscribe(() => this.loadMovies());
  }
}
