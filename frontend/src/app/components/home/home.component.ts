import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0] as File;
    const formData = new FormData();
    formData.append('image', file, file.name);
    this.httpClient.post(environment.endpointURL + 'products/1/image', formData).subscribe(res => {
      console.log(res);
    });
  }
}
