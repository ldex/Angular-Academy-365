import {ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle} from '@angular/router';

export class CustomRouteReuseStrategy extends BaseRouteReuseStrategy {
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}