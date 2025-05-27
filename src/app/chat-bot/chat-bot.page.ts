import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './chat-bot.page.html',
  styleUrls: ['./chat-bot.page.scss'],
})
export class ChatBotPage {
  messages: { text: string, sender: 'user' | 'bot' }[] = [];
  newMessage: string = '';
  constructor(private http: HttpClient, private router: Router) {}


  sendMessage() {
    const message = this.newMessage.trim();
    if (!message) return;

    // Simpan user message
    this.messages.push({ text: message, sender: 'user' });

    // Reset input
    this.newMessage = '';

    // Auto reply dari bot berdasarkan mesej user
    setTimeout(() => {
      const reply = this.getBotReply(message);
      this.messages.push({ text: reply, sender: 'bot' });
    }, 600);
  }

  getBotReply(message: string): string {
    message = message.toLowerCase();

    if (message.includes('buka') || message.includes('jam')) {
      return 'Kami beroperasi setiap hari dari 9 pagi hingga 9 malam.';
    } else if (message.includes('harga') || message.includes('battery')) {
      return 'Harga bateri bermula dari RM150 hingga RM350 bergantung pada model.';
    } else if (message.includes('hai') || message.includes('hello')) {
      return 'Hai! Saya BatBot, pembantu pintar anda untuk semua masalah bateri kereta. Nak saya bantu?';
    } else {
      return 'Terima kasih atas pertanyaan anda! Wakil kami akan hubungi anda secepat mungkin.';
    }
  }
}