import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../services/agent.service';
import { apiErrorMessage } from '../../services/api-error-message';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

@Component({
  selector: 'app-agent',
  imports: [FormsModule],
  templateUrl: './agent.html',
  styleUrl: './agent.scss',
})
export class Agent {
  private readonly agentService = inject(AgentService);

  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLTextAreaElement>;

  readonly suggestions = [
    '¿Qué máquinas necesitan mantenimiento?',
    '¿Qué máquinas están en riesgo?',
    'Resume el estado de las máquinas',
  ];
  readonly messages = signal<ChatMessage[]>([{
    role: 'assistant',
    text: 'Hola, puedo ayudarte a consultar el estado y mantenimiento de tus máquinas. ¿Qué necesitas saber?',
  }]);
  draft = '';
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  

  sendMessage(message = this.draft): void {
    const question = message.trim();
    if (!question || this.isLoading()) return;

    this.messages.update((messages) => [...messages, { role: 'user', text: question }]);
    this.draft = '';
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.agentService.chat(question).subscribe({
      next: (response) => {
        const answer = response?.answer?.trim();
        this.messages.update((messages) => [
          ...messages,
          {
            role: 'assistant',
            text: answer || 'El asistente no devolvió una respuesta.',
          },
        ]);
        this.isLoading.set(false);
        this.focusInput();
      },
      error: (error: unknown) => {
        const message = error instanceof Error && error.message
          ? error.message
          : apiErrorMessage(error, 'No se pudo conectar con el asistente. Inténtalo de nuevo.');
        this.errorMessage.set(message);
        this.isLoading.set(false);
        this.focusInput();
      },
    });
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !this.isLoading()) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private focusInput(): void {
    setTimeout(() => this.messageInput?.nativeElement.focus());
  }
}
