import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clase5-a';
  bActivo: boolean = true;

  ocultar(){
    this.bActivo = !this.bActivo
  }
}
