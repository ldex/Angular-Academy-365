import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, shareReplay, tap, first, map, mergeAll, BehaviorSubject, switchMap, of, filter, max } from 'rxjs';
import { Product } from '../products/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'https://storerestservice.azurewebsites.net/api/products/';
  private productsSubject = new BehaviorSubject([]);
  products$: Observable<Product[]> = this.productsSubject.asObservable();
  mostExpensiveProduct$: Observable<Product>;

  constructor(private http: HttpClient) {
    this.initProducts();
    this.initMostExpensiveProduct();
  }

  private initMostExpensiveProduct() {
    this.mostExpensiveProduct$ =
      this
      .products$
      .pipe(
        filter(products => products.length > 0),
        switchMap(
          products => of(products)
                      .pipe(
                        map(products => [...products].sort((p1, p2) => p1.price > p2.price ? -1 : 1)),
                        // [{p1}, {p2}, {p3}]
                        mergeAll(),
                        // {p1}, {p2}, {p3}
                        first()
                      )
        )
      )

      // Another way:
      // this.mostExpensiveProduct$ = this.products$.pipe(
      //   mergeAll(),
      //   max((x, y) => x.price < y.price ? -1 : 1),
      //   tap((value) => console.log('max', value))
      // );
  }

  productsToLoad: number = 10;

  initProducts(skip = 0, take = this.productsToLoad) {
    let url = this.baseUrl + `?$skip=${skip}&$top=${take}&$orderby=ModifiedDate%20desc`;

    this
      .http
      .get<Product[]>(url)
      .pipe(
        delay(1500), // For the demo...
        tap(console.table),
        shareReplay(),
        map(
          newProducts => {
            let currentProducts = this.productsSubject.value;
            return currentProducts.concat(newProducts)
          }
        )
      )
      .subscribe(
        fullProductsList => this.productsSubject.next(fullProductsList)
      );
  }

  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, newProduct).pipe(delay(2000));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);
  }

  resetList() {
    this.productsSubject.next([]);
    this.initProducts();
  }
}
