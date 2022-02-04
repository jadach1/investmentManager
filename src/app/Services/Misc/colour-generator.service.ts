import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColourGeneratorService {
  colorMap = new Map();
  colourList: string[] = [
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'black',
    'pink'
  ]
  fontList: string[] = [
    'Arial',
    'Arial Black',
    'Bahnschrift',
    'Calibri',
    'Cambria',
    'Cambria Math',
    'Candara',
    'Comic Sans MS',
    'Consolas',
    'Constantia',
    'Corbel',
    'Courier New',
    'Ebrima',
    'Franklin Gothic Medium',
    'Gabriola',
    'Gadugi',
    'Georgia',
    'HoloLens MDL2 Assets',
    'Impact',
    'Ink Free',
    'Javanese Text',
    'Leelawadee UI',
    'Lucida Console',
    'Lucida Sans Unicode',
    'Malgun Gothic',
    'Marlett',
    'Microsoft Himalaya',
    'Microsoft JhengHei',
    'Microsoft New Tai Lue',
    'Microsoft PhagsPa',
    'Microsoft Sans Serif',
    'Microsoft Tai Le',
    'Microsoft YaHei',
    'Microsoft Yi Baiti',
    'MingLiU-ExtB',
    'Mongolian Baiti',
    'MS Gothic',
    'MV Boli',
    'Myanmar Text',
    'Nirmala UI',
    'Palatino Linotype'
    ]

    constructor() { 
      this.colorMap.set('A','#008080');
      this.colorMap.set('B','#008000');
      this.colorMap.set('C','#00BFFF');
      this.colorMap.set('D','#00FF00');
      this.colorMap.set('E','#00FFFF');
      this.colorMap.set('F','#20B2AA');
      this.colorMap.set('G','#4169E1');
      this.colorMap.set('H','#483D8B');
      this.colorMap.set('I','#800000');
      this.colorMap.set('J','#8B4513');
      this.colorMap.set('K','#ADD8E6');
      this.colorMap.set('L','#C71585');
      this.colorMap.set('M','#D2691E');
      this.colorMap.set('N','#DAA520');
      this.colorMap.set('O','#DC143C');
      this.colorMap.set('P','#DDA0DD');
      this.colorMap.set('Q','#EE82EE');
      this.colorMap.set('R','#FF0000');
      this.colorMap.set('S','#FF00FF');
      this.colorMap.set('T','#FF4500');
      this.colorMap.set('U','#FFD700');
      this.colorMap.set('V','#FFDEAD');
      this.colorMap.set('W','#FFFACD');
      this.colorMap.set('X','#FFFF00');
      this.colorMap.set('Y','#778899');
      this.colorMap.set('Z','#696969');
    }

     generateColour(): string {
        return this.colourList[Math.floor(Math.random()*7)];
        //return 'red';
    }

    getCount(){
        alert("t: " + this.generateFont())
    }

    generateFont(): string{
      let newFont = Math.floor(Math.random()*41);
      return this.fontList[newFont];
    }

    generateByLetter(symbol: string): String{
      let str: String;
      str = this.colorMap.get(symbol.toUpperCase().substring(0,1));
      return str;
    }
}
