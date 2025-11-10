import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {of, switchMap} from 'rxjs';

interface StreamingHistory {
  content_name: string;
  episode_id: number | null;
  timestamp: string;
}

@Component({
  selector: 'app-streaming-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streaming-history.component.html',
  styleUrl: './streaming-history.component.scss'
})
export class StreamingHistoryComponent implements OnInit {
  streamingHistory: StreamingHistory[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchStreamingHistory();
  }

  fetchStreamingHistory(): void {
    this.authService.email$.pipe(
      switchMap(email => {
        console.log('Email:', email);
        if (!email) {
          return of([]);
        }
        return this.http.get<StreamingHistory[]>(`api/content/streaming-history`, {params: {email}});
      })
    ).subscribe(history => {
      console.log('Streaming History:', history);
      this.streamingHistory = history;
      this.cdr.detectChanges();
    });
  }
}
