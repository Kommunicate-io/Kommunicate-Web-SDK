import {Component} from '@angular/core';
import {ViewChild} from '@angular/core';
@Component({
   selector: 'components',
   templateUrl: './bot.html'
})
 
export class Components {

constructor() {
  }

clicked(event) {
   console.log(this.itemId.nativeElement.classList.contains('vis')); 
  event.target.classList.add('n-vis'); // To ADD
  event.target.classList.remove('vis'); // To Remove
   this.itemId.nativeElement.classList.remove('n-vis');
  this.itemId.nativeElement.classList.add('vis');
}

@ViewChild('itemId') itemId;
  

}
 
