import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[]= [];
  errorMessages: string[] = [];

  constructor(private toast: ToastrService){

  }
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

  /*EXPERIMENT WITH TOASTS */

  sendToast(msg: string, title: string, type: number){
    switch(type){
      case 1:
        this.toast.success(msg, title);
        break;
      case 2:
        this.toast.error(msg, title);
        break;
      case 3:
        this.toast.error(msg, title);
        break;
      case 4:
        this.toast.error(msg, title);
        break;
    }
  }
}
