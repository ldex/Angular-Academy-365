import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../products/product.interface';


@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor() { }

  private favourites: Set<Product> = new Set();

  addToFavourites(product: Product) {
    this.favourites.add(product);
  }

  getFavouritesNb(): number {
    return this.favourites.size;
  }
}
