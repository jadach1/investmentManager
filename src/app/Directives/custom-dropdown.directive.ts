import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCustomDropdown]'
})
export class CustomDropdownDirective {
  @HostBinding('class.show') customList: boolean = true;
  @HostListener('click') mouseclick(){
    console.log("working " + this.customList)
    // this.customList = !this.customList;
  }
  constructor() { }

}
