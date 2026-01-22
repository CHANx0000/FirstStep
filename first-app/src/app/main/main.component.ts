import { Component, OnInit } from '@angular/core';
import { from, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import Groq from 'groq-sdk';
import { environment } from '../../environments/environment';

const client = new Groq({
  apiKey: environment.groqApiKey,
  dangerouslyAllowBrowser: true,
});

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  message: string = '';
  response: string = '';
  loading: boolean = false;

  ngOnInit(): void {
    console.log('MainComponent initialized');
  }

  submitPost(userMessage: string): void {
    if (!userMessage || !userMessage.trim()) {
      this.response = 'Please enter a message';
      return;
    }

    this.message = userMessage;
    this.response = '';
    this.loading = true;

    const apiCall$ = from(
      client.chat.completions.create({
        model: 'openai/gpt-oss-20b', // Using a valid Groq model
        messages: [{ role: 'user', content: userMessage }],
      })
    );

    apiCall$
      .pipe(
        tap(() => console.log('Starting API call...')),
        tap((result) => {
          console.log('API response received:', result);
          
          if (result.choices && result.choices.length > 0 && result.choices[0].message) {
            this.response = result.choices[0].message.content || 'No response from model';
          } else {
            this.response = 'No response from model';
          }
          
          console.log('Final response:', this.response);
        }),
        catchError((error: any) => {
          console.error('API Error:', error);
          this.response = 'Error: ' + (error?.message || String(error));
          return of(null); // Return a safe value to continue the stream
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }
}