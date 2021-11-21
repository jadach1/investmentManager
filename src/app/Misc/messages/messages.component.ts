import { Component, OnInit } from '@angular/core';

import {MessageService}      from '../../Services/Messages/message.service'
import {ColourGeneratorService}      from '../../Services/Misc/colour-generator.service'
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public messageService: MessageService, public colourGenSer: ColourGeneratorService) { }

  ngOnInit(): void {
  }

}
