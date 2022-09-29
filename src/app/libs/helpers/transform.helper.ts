import { Drinks } from "../entities/drinks.interface"

export default class Transform {


  public static drinks(drinks: any[]): Drinks[]{
    let cocktails =  drinks.map(drink => {

      let ingredients: string[] = []

      Object.keys(drink).forEach(key => {

        if(key.includes('strIngredient') && drink[key]){
          ingredients.push(drink[key])
        }
      })

      return {
        name: drink.strDrink,
        img: drink.strDrinkThumb,
        ingredients: ingredients
      }
    })

    return cocktails;
  }
}