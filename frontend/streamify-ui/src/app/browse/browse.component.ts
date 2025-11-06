import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Updated interfaces to match the backend response
export interface Sequel {
  content_id: string;
  poster_url: string;
}

export interface MovieDetails {
  poster_url: string;
  IMDB_link: string;
  content_name: string;
  release_date: string;
  genre: string;
  director: string;
  cast: string;
  awards: string;
}

export interface MovieDetailsResponse {
  details: MovieDetails[];
  sequels: Sequel[];
}

// Basic movie info for the browse grid
export interface Movie {
  content_id: string;
  content_name: string;
  poster_url: string;
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  movies: Movie[] = [];
  selectedMovieDetails: MovieDetailsResponse | null = null;
  isModalVisible = false;
  isModalLoading = false;
  apiUrl = "/api/content"; // Using the proxy

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.http.get<Movie[]>(`${this.apiUrl}/browse/movies`)
      .subscribe(movies => {
        this.movies = movies;
        this.cdr.detectChanges();
      });
  }

  openMovieDetails(movie: Movie | Sequel): void {
    this.isModalVisible = true;
    this.isModalLoading = true;
    this.selectedMovieDetails = null;

    const params = new HttpParams().set('content_id', movie.content_id);

    this.http.get<MovieDetailsResponse>(`${this.apiUrl}/movie-details`, { params })
      .subscribe(details => {
        this.selectedMovieDetails = details;
        this.isModalLoading = false;
        this.cdr.detectChanges();
      });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedMovieDetails = null;
  }
}
