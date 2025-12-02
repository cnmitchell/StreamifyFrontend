import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';

export interface TopTen {
  content_id: string;
  content_name: string;
  stream_count: number;
  genre: string;
  release_date: string;

}

@Component({
  selector: 'app-top-ten',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-ten.component.html',
  styleUrls: ['./top-ten.component.scss']
})

export class TopTenComponent implements OnInit {

  topTen$: Observable<TopTen[]> | undefined;
  apiUrl = "/api/content";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTopTen();
  }

  loadTopTen() {
    this.topTen$ = this.http.get<TopTen[]>(`${this.apiUrl}/top-ten-streamed`);
  }
}
