import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  ngOnInit(): void {
    console.log('MainComponent initialized');
  }
  message: string = '';
  response: string = '';

  async submitPost(value: string) {
    this.message = value;

    // TODO: Call API service here
  }
}
