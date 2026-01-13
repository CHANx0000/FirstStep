import { Component, OnInit } from '@angular/core';
import Groq from 'groq-sdk';

// WARNING: API key is embedded here for demonstration as requested.
// Do NOT commit this key to version control; consider using environment variables instead.
// NOTE: The SDK blocks usage in browser environments by default. For local testing only,
// you can set `dangerouslyAllowBrowser: true`. This exposes the key in client bundles
// and is NOT safe for production or public deployments.

//new commit from trial branch 2

const groq = new Groq({
  apiKey: '',
  dangerouslyAllowBrowser: true,
});

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
  loading: boolean = false;

  async submitPost(value: string) {
    this.message = value;
    this.response = '';

    if (!value || !value.trim()) {
      this.response = 'Please enter some text to submit.';
      return;
    }

    try {
      this.loading = true;
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: value,
          },
        ],
        model: 'openai/gpt-oss-20b',
      });

      this.response =
        chatCompletion?.choices?.[0]?.message?.content ||
        'No response from model.';
    } catch (err: any) {
      console.error('Groq API error', err);
      this.response =
        'Error calling Groq API: ' + (err?.message || String(err));
    } finally {
      this.loading = false;
    }
  }
}
