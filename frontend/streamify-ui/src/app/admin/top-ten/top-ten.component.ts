import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Movie} from '../../browse/browse.component';


@Component({
  selector: 'app-top-ten',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-ten.component.html',
  styleUrls: ['./top-ten.component.scss']
})

export class TopTenComponent implements OnInit {

  topTen: Movie[] = [];
  apiUrl = "/api/content";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTopTen();
  }

  loadTopTen() {
    this.http.get<Movie[]>(`${this.apiUrl}/top-ten-streamed`)
      .subscribe(data => {
        this.topTen = data;
      });
  }
}
