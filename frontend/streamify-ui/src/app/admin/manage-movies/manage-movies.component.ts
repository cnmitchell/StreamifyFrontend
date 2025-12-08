import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Content } from '../../member/browse/browse.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

export interface PersonRequest {
  person_id?: string;
  name: string;
  state?: string;
  country?: string;
}

export interface AwardRequest {
  award_name: string;
  award_year: number;
}

export interface Episode {
  season_number: number;
  episode_number: number;
  title: string;
}

export interface Season {
  season_number: number;
  episodes: {
    episode_number: number;
    episode_title: string;
  }[];
}

export interface AddFullContentRequest {
  content_name: string;
  IMDB_link?: string;
  release_date: string;
  genre: string;
  poster_url?: string;
  sequel_to?: string;
  total_episodes?: String;
  total_seasons?: String;
  cast: PersonRequest[];
  directors: PersonRequest[];
  awards: AwardRequest[];
  episodes?: Episode[];
}

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-movies.component.html',
  styleUrls: ['./manage-movies.component.scss']
})
export class ManageMoviesComponent implements OnInit {

  movies: Content[] = [];
  newContent: AddFullContentRequest = this.resetNewContent();
  selectedMovie: any = null;
  apiUrl = "/api";
  showAddContentForm = false;
  contentType: 'movie' | 'series' = 'movie';
  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Documentary', 'Anime', 'Adventure', 'Fantasy', 'Musical'];
  seasons: Season[] = [];

  directorSearchResults: PersonRequest[] = [];
  castSearchResults: PersonRequest[][] = [[], [], []];
  private directorSearchTerms = new Subject<string>();
  private castSearchTerms: Subject<{ query: string; index: number }> [] = Array.from({length: 3}, () => new Subject());

  directorNotFound: boolean = false;
  castNotFound: boolean[] = Array(3).fill(false);

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.setupCastSearch();
  }

  ngOnInit(): void {
    this.loadMovies();
    this.directorSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        console.log('Inside director switchMap, term:', term);
        if (term.length < 2) {
          this.directorSearchResults = [];
          this.directorNotFound = false;
          this.cdr.detectChanges();
          return of([]);
        }
        console.log('Making HTTP request for directors with term:', term);
        return this.http.get<PersonRequest[]>(`${this.apiUrl}/content/person/search`, { params: { name: term } });
      })
    ).subscribe(results => {
      console.log('Director search results:', results);
      this.directorSearchResults = results;
      this.directorNotFound = results.length === 0 && this.newContent.directors[0].name.length > 1;
      console.log('directorNotFound after assignment:', this.directorNotFound);
      this.cdr.detectChanges();
    });
  }

  setupCastSearch(): void {
    this.castSearchTerms = Array(3).fill(null).map(() => new Subject<{ query: string, index: number }>());
    this.castSearchTerms.forEach((subject, index) => {
      subject.pipe(
        debounceTime(300),
        distinctUntilChanged((p, q) => p.query === q.query),
        switchMap(search => {
          console.log(`Inside cast switchMap for index ${search.index}, term: ${search.query}`);
          if (search.query.length < 2) {
            this.castSearchResults[index] = [];
            this.castNotFound[index] = false;
            this.cdr.detectChanges();
            return of([]);
          }
          console.log(`Making HTTP request for cast with term: ${search.query} at index ${search.index}`);
          return this.http.get<PersonRequest[]>(`${this.apiUrl}/content/person/search`, { params: { name: search.query } });
        })
      ).subscribe(results => {
        console.log('Cast search results for index:', index, results);
        this.castSearchResults[index] = results;
        // Set castNotFound based on results and current input term
        this.castNotFound[index] = results.length === 0 && this.newContent.cast[index].name.length > 1;
        console.log(`castNotFound[${index}] after assignment:`, this.castNotFound[index]);
        this.cdr.detectChanges();
      });
    });
  }

  searchDirectors(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    console.log('Director input event, term:', term);

    if (this.newContent.directors[0].person_id && this.newContent.directors[0].name !== term) {
      this.newContent.directors[0].person_id = undefined;
      this.newContent.directors[0].state = undefined;
      this.newContent.directors[0].country = undefined;
    }
    this.directorNotFound = false;
    this.directorSearchTerms.next(term);
  }

  searchCast(event: Event, index: number): void {
    const term = (event.target as HTMLInputElement).value;
    console.log(`Cast input event for index ${index}, term:`, term);

    if (this.newContent.cast[index].person_id && this.newContent.cast[index].name !== term) {
      this.newContent.cast[index].person_id = undefined;
      this.newContent.cast[index].state = undefined;
      this.newContent.cast[index].country = undefined;
    }
    this.castNotFound[index] = false;
    this.castSearchTerms[index].next({ query: term, index });
  }

  selectDirector(person: PersonRequest): void {
    console.log('Selected director:', person);
    this.newContent.directors[0] = { ...person };
    this.directorSearchResults = [];
    this.directorNotFound = false;
    this.cdr.detectChanges();
  }

  selectCast(person: PersonRequest, index: number): void {
    console.log('Selected cast member:', person, 'at index:', index);
    this.newContent.cast[index] = { ...person };
    this.castSearchResults[index] = [];
    this.castNotFound[index] = false;
    this.cdr.detectChanges();
  }

  loadMovies(): void {
    this.http.get<Content[]>(`${this.apiUrl}/content/all-content`)
      .subscribe({
        next: movies => {
          this.movies = movies;
          this.cdr.detectChanges();
        },
        error: err => console.error('Error fetching movies:', err)
      });
  }

  addContent(): void {
    const request: AddFullContentRequest = { ...this.newContent };

    if (this.contentType === 'series') {
      request.total_seasons = String(this.seasons.length);
      request.episodes = this.seasons.flatMap(season =>
        season.episodes.map(episode => ({
          season_number: season.season_number,
          episode_number: episode.episode_number,
          title: episode.episode_title
        }))
      );
      request.total_episodes = String(request.episodes.length);
    }

    console.log('Adding content with request:', request);

    this.http.post(`${this.apiUrl}/content/full-content`, request)
      .subscribe({
        next: () => {
          this.loadMovies();
          this.resetAndHideForm();
        },
        error: err => console.error('Error adding content:', err)
      });
  }


  deleteMovie(id: string): void {
    this.http.delete(`${this.apiUrl}/content/${id}`)
      .subscribe({
        next: () => {
          this.movies = this.movies.filter(movie => movie.content_id !== id);
          this.cdr.detectChanges();
        },
        error: err => console.error('Error deleting movie:', err)
      });
  }

  updateSeasons(): void {
    const seasonCount = Number(this.newContent.total_seasons) || 0;
    this.seasons = Array.from({ length: seasonCount }, (_, i) => {
      const existingSeason = this.seasons[i];
      return existingSeason ? existingSeason : {
        season_number: i + 1,
        episodes: []
      };
    });
    this.cdr.detectChanges();
  }

  addEpisode(seasonIndex: number): void {
    const season = this.seasons[seasonIndex];
    const episodeNumber = season.episodes.length + 1;
    const episodeTitle = prompt(`Enter title for Season ${season.season_number}, Episode ${episodeNumber}:`);
    if (episodeTitle) {
      season.episodes.push({ episode_number: episodeNumber, episode_title: episodeTitle });
    }
    this.cdr.detectChanges();
  }

  resetNewContent(): AddFullContentRequest {
    return {
      content_name: '',
      release_date: '',
      genre: '',
      cast: Array(3).fill(null).map(() => ({ name: '', state: '', country: '' })),
      directors: [{ name: '', state: '', country: '' }],
      awards: []
    };
  }

  resetAndHideForm(): void {
    this.newContent = this.resetNewContent();
    this.showAddContentForm = false;
    this.contentType = 'movie';
    this.seasons = [];
    this.directorSearchResults = [];
    this.castSearchResults = [[], [], []];
    this.directorNotFound = false;
    this.castNotFound = Array(3).fill(false);
    this.cdr.detectChanges();
  }
}
