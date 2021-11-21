import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[]= [];
  errorMessages: string[] = [];

  add(message: string){
    this.messages.push(message);
  }

  clear(){
    this.messages = [];
  }

  addError(message: string){
    this.errorMessages.push(message);
  }

  clearErrors(){
    this.errorMessages = [];
  }
}
