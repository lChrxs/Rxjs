import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, merge } from 'rxjs'
import { combineLatestAll, concatMap, map, tap } from 'rxjs/operators';
import Transform from '../libs/helpers/transform.helper';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private toSearch: Observable<any>[] = []

  constructor(private http: HttpClient) { }

  getCocktails(bebida: string): Observable<any>{
    return this.http.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${bebida}`).pipe(
      map((res: any) => {
        return Transform.drinks(res.drinks) //Se manda a llamar la clase con su metodo drinks
      })
    )
  }

/**
 * We make a request to the Pokemon API for Pikachu, then we make a request to the Species API for
 * Pikachu, then we make a request to the Varieties API for Pikachu, then we return the result of the
 * Varieties API request
 * @returns The observable of the getPokemon() method.
 */
  getPokemon(): Observable<any>{ //*Peticion principal
    return this.http.get('https://pokeapi.co/api/v2/pokemon/pikachu').pipe( //*Hace la primer peticion a pokemon/pikachu
      map((resPokemon: any) => {
        let newResPokemon = {
          name: resPokemon.name,
          stats: resPokemon.stats,
          species: resPokemon.species
        }
        console.log('New response', newResPokemon);
        
        return newResPokemon
      }),
      concatMap((newResPokemon: any) => { //*Concatena la peticion de getSpecies con la peticion pokemon/pikachu
        return this.getSpecies(newResPokemon.species.url, newResPokemon) //Le pasamos la url del endPoint de Species y la respuesta de la peticion a pokemon/pikachu
      }),
      concatMap((resSpecies: any) => { //*Concatena la peticion de getVarieties con la de getSpecies y pokemon/pikachu
        return this.getVarieties(resSpecies);
      }),
      tap (res => {
        console.log('Tap2: ', res); //Aqui ya tenemos las 3 respuestas concatenadas en una
      })
    )
  }


/**
 * We're taking the url of the species, and the original pokemon object, and returning an observable
 * that will return the species object with the original pokemon object merged into it
 * @param {string} url - the url of the species
 * @param {any} original - any - this is the original object that we want to add the species data to.
 * @returns The original pokemon object and the species object.
 */
  getSpecies(url: string, original: any): Observable<any>{
    return this.http.get(url).pipe(
      map((resSpecies: any) => {

        let newResSpecies: any[] = resSpecies.varieties
        
        newResSpecies.forEach(el => { //resSpecies.varieties es un arreglo de las variedades del pokemon con su url al endpoint de cada una
          this.toSearch.push(this.http.get(el.pokemon.url)) //Obtenemos cada url de las variedad y la juntamos a su peticion http para guardar las peticiones en toSearch
        }) 
        console.log(this.toSearch)
        delete original['species']

        return { //Solo regresamos la respuesta original ya que de species solo nos interesa obtner las urls a los endpoints de las variedades
          ...original //Regresamos la respuesta de resSpecies y la respuesta de pokemon/pikachu
        }
      })
    )
  }


/**
 * It takes an array of observables, and returns an observable that emits an array of the latest values
 * from each of the observables
 * @param {any} original - any: The original object that we want to add the sprites to.
 * @returns An Observable that emits an object with the original data and the sprites array.
 */
  getVarieties(original: any): Observable<any>{
    return merge(this.toSearch).pipe(  //El merge recibe Observables, entra al map tantas veces como argumentos tenga, en este caso le mandamos un arreglo de observables
      tap(res => {
        console.log('Before respose de combineLatestAll', res) //Aqui vemos que merge si entra sobre cada Observable sin ejecutarlo
      }),
      combineLatestAll(), //*1.Ejecuta los Observables del arreglo | 2.junta las respuestas en un arreglo
      // EL combine all ejecuta cada peticion del arreglo, espera su respuesta y la guarda en un arreglo
      map(res => { //Hacemos map del arreglo de respuestas que regreso combineLatestAll
        console.log('Merged', res)
        let sprites = res.map(item => { //De cada respuesta de varieties solo guardamos el name y la imagen de la variedad del pokemon
          return {
            name: item.name,
            img: item.sprites.front_default
          }
        })

        return { //Regresamos original que son las 2 peticiones combinadas mas la nueva key que reemplaza la key sprites por la que hicimos
          ...original, 
          sprites: sprites
        }
        
      })
    )
  }

}
