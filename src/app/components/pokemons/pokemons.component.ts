import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.scss']
})
export class PokemonsComponent implements OnInit {

  public pokemon$!: Observable<any>

  constructor(public pokemonS: RequestService) { 

    //Como del lado del servicio ya transformamos las respuestas en lo que necesitamos, ya solo llamamos una funcion que se encarga de obtener las respuestas de los 3 servicios y traerlas en una sola
    this.pokemon$ = this.pokemonS.getPokemon()

  }

  ngOnInit(): void {
  }

}
