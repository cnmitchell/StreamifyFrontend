import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
  // TODO: Get email from a service
  email = 'user@example.com';
  apiUrl = 'http://localhost:8080/api/content';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchStreamingHistory();
  }

  fetchStreamingHistory(): void {
    this.http.get<StreamingHistory[]>(`${this.apiUrl}/streaming-history`, { params: { email: this.email } })
      .subscribe(history => {
        this.streamingHistory = history;
      });
  }
}
