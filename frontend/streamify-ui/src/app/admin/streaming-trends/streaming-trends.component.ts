import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';

export interface Trends {
  content_id: string;
  content_name: string;
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

  /*
  buildChart() {
    const labels = this.trends.map(item => item.title);
    const dataPoints = this.trends.map(item => item.stream_count);

    new Chart("trends",{
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Streams in the last 24 hours",
          data: dataPoints,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {beginAtZero: true},
        }
      }
    });
  }

   */

}
