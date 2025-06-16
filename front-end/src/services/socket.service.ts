import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment.development';

@Injectable({ providedIn: 'root' })

export class SocketService {

  private socket: Socket;

  constructor() {

    // Remplace l'URL par l'adresse de ton serveur si besoin
    this.socket = io(environment.basedUrl, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.info('Connected to WebSocket server - socket id: ', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.info('Disconnected from WebSocket server');
    });
  }

  emit(event: string, data: any) {
    console.info("[CLIENT] ", event, "emitted - ", data)
    this.socket.emit(event, data);
  }

  listen(event: string, callback: (...args: any[]) => void) {
    console.info("[CLIENT] listened - ", event)
    this.socket.on(event, callback);
  }

  listenOnce<T = any>(event: string): Promise<T> {
    return new Promise((resolve) => {
      this.socket.once(event, (data: T) => {
        console.info("[CLIENT] listened once - ", event)
        resolve(data);
      });
    });
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) this.socket.off(event, callback);
    else this.socket.removeAllListeners(event);
  }
}
