import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Interfaces (Sequel, MovieDetails, etc.) remain the same
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

export interface Movie {
  content_id: string;
  content_name: string;
  poster_url: string;
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  movies: Movie[] = [];
  selectedMovieDetails: MovieDetailsResponse | null = null;
  isModalVisible = false;
  isModalLoading = false;
  searchForm: FormGroup;
  apiUrl = "/api/content";

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      keyword: [''],
      genre: [''],
      actor: [''],
      director: ['']
    });
  }

  ngOnInit(): void {
    this.fetchMovies();
    // Removed the valueChanges subscription
  }

  fetchMovies(): void {
    console.log('Starting fetchMovies');
    try {
      let params = new HttpParams();
      const formValues = this.searchForm.value;

      Object.keys(formValues).forEach(key => {
        const value = formValues[key];
        if (value) {
          params = params.append(key, value);
        }
      });

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
