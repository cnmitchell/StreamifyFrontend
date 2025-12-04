import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

export interface Content {
  content_id: string;
  content_name: string;
  poster_url: string;
}

export interface ContentDetails {
  poster_url: string;
  IMDB_link: string;
  content_name: string;
  release_date: string;
  genre: string;
  director: string;
  cast: string;
  awards: string;
}

export interface ContentDetailsResponse {
  details: ContentDetails[];
  sequels?: Content[];
}

export interface Episode {
  episode_number: number;
  title: string;
}

export interface SeriesContent {
  [season_number: string]: Episode[];
}

export interface SeriesDetailsResponse {
  details: ContentDetails[];
  num_seasons: number;
  content: SeriesContent;
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  movies: Content[] = [];
  series: Content[] = [];
  selectedDetails: ContentDetailsResponse | null = null;
  selectedSeriesDetails: SeriesDetailsResponse | null = null;
  selectedSeason: string | null = null;
  selectedEpisode: Episode | null = null;
  seasons: string[] = [];
  episodes: Episode[] = [];
  isModalVisible = false;
  isModalLoading = false;
  searchForm: FormGroup;
  apiUrl = "/api/content";
  activeTab: 'movies' | 'series' = 'movies';
  private userEmail: string | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      keyword: [''],
      genre: [''],
      actor: [''],
      director: [''],
      awardWinning: [false],
      neverWatched: [false]
    });
  }

  ngOnInit(): void {
    this.authService.member$.subscribe(member => {
      this.userEmail = member ? member.email : null;
      this.loadData();
    });

    this.searchForm.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadData();
    });
  }

  selectTab(tab: 'movies' | 'series'): void {
    this.activeTab = tab;
    this.loadData();
  }

  loadData(): void {
    if (this.activeTab === 'movies') {
      this.fetchContent('movies');
    } else {
      this.fetchContent('series');
    }
  }

  fetchContent(type: 'movies' | 'series'): void {
    const formValues = this.searchForm.value;
    const endpoint = `${this.apiUrl}/browse/${type}`;
    let params = new HttpParams();

    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      if (value) {
        if (key === 'neverWatched' && this.activeTab === 'series' && this.userEmail) {
          params = params.append('email', this.userEmail);
        } else if (key !== 'neverWatched') {
          params = params.append(key, value.toString());
        }
      }
    });

    this.http.get<Content[]>(endpoint, { params })
      .subscribe({
        next: data => {
          if (type === 'movies') {
            this.movies = data;
          } else {
            this.series = data;
          }
          this.cdr.detectChanges();
        },
        error: err => {
          console.error(`Error fetching ${type}:`, err);
        }
      });
  }

  openMovieDetails(movie: Content): void {
    this.isModalVisible = true;
    this.isModalLoading = true;
    this.selectedDetails = null;
    this.selectedSeriesDetails = null;

    const params = new HttpParams().set('content_id', movie.content_id);

    this.http.get<ContentDetailsResponse>(`${this.apiUrl}/movie-details`, { params })
      .subscribe(details => {
        this.selectedDetails = details;
        this.isModalLoading = false;
        this.cdr.detectChanges();
      });
  }

  openSeriesDetails(seriesItem: Content): void {
    this.isModalVisible = true;
    this.isModalLoading = true;
    this.selectedDetails = null;
    this.selectedSeriesDetails = null;

    const params = new HttpParams().set('content_id', seriesItem.content_id);

    this.http.get<SeriesDetailsResponse>(`${this.apiUrl}/series-details`, { params })
      .subscribe(details => {
        this.selectedSeriesDetails = details;
        if (details.num_seasons > 0) {
          this.seasons = Object.keys(details.content);
          this.onSeasonChange(this.seasons[0]);
        }
        this.isModalLoading = false;
        this.cdr.detectChanges();
      });
  }

  onSeasonChange(season: string): void {
    this.selectedSeason = season;
    if (this.selectedSeriesDetails) {
      this.episodes = this.selectedSeriesDetails.content[season];
      if (this.episodes && this.episodes.length > 0) {
        this.selectedEpisode = this.episodes[0];
      } else {
        this.selectedEpisode = null;
      }
    }
  }

  onEpisodeChange(episode: Episode): void {
    this.selectedEpisode = episode;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedDetails = null;
    this.selectedSeriesDetails = null;
    this.selectedSeason = null;
    this.selectedEpisode = null;
    this.seasons = [];
    this.episodes = [];
  }
}
