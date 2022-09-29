import { Component, OnInit } from '@angular/core';
import { Drinks } from 'src/app/libs/entities/drinks.interface';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss']
})
export class DrinksComponent implements OnInit {

  bebidas: Drinks[] = []

  constructor(public cocktailS: RequestService) { }

  ngOnInit(): void {

    this.cocktailS.getCocktails('margarita').subscribe({
      next: ((res: Drinks[]) => {
        this.bebidas = res;
      })
    })
  }

}
