import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';

export interface Trends {
  stream_id: string;
  content_name: string;
  timestamp: string;
  email: string;
}


@Component({
  selector: 'app-streaming-trends',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './streaming-trends.component.html',
  styleUrls: ['./streaming-trends.component.scss'],
})

export class StreamingTrendsComponent implements OnInit {

  apiUrl = "/api/content"
  trends$: Observable<Trends[]> | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadTrends()
  }

  loadTrends(){
    this.trends$ = this.http.get<Trends[]>(`${this.apiUrl}/last-24h-trends`);
    console.log(this.trends$);
  }
}
