import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { HTTPService } from '../service/http.service';
import { Subject } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Injectable()
export class UserGuard implements CanActivate {
    private loader$ = new Subject<boolean>();
    public loader = false;

    constructor(private router: Router, private httpService: HTTPService) {
        this.loader$.subscribe((loader: any) => {
            this.loader = loader;
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        this.loader$.next(true);
        return new Promise((resolve, reject) => {
            if (localStorage.getItem('user') && localStorage.getItem('password')) {
                this.httpService.Login(localStorage.getItem('user'), localStorage.getItem('password')).subscribe((resultEvent: any) => {
                    if (resultEvent.type === HttpEventType.Response) {
                        var res = resultEvent.body;
                        this.loader$.next(false);
                        if (res == true) {
                            resolve(true);
                        }
                        else {
                            this.router.navigate(['/login']);
                            resolve(false);
                        }
                    }
                })
            }
            else {
                resolve(false)
            }
        });
    }
}