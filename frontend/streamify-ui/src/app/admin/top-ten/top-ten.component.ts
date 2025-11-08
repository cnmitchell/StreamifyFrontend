import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

export interface TopTen {
  content_id: string;
  content_name: string;
  stream_amount: number;

}

@Component({
  selector: 'app-top-ten',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-ten.component.html',
  styleUrls: ['./top-ten.component.scss']
})

export class TopTenComponent implements OnInit {

  topTen: TopTen[] = [];
  apiUrl = "/api/content";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTopTen();
  }

  loadTopTen() {
    this.http.get<TopTen[]>(`${this.apiUrl}/top-ten-streamed`)
      .subscribe(data => {
        this.topTen = data;
        console.log(this.topTen);
      });
  }
}
