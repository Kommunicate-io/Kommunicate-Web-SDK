import {Component} from '@angular/core';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {

  constructor() {
  }

myFunc(){
    console.log("function called");
  }
onSuccess() {
    console.log('on success');
  }
}
