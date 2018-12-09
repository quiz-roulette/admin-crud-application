import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Server } from 'selenium-webdriver/safari';
import { HTTPService } from '../service/http.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private router: Router, private httpService: HTTPService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            return new Promise((resolve, reject) => {
                if (localStorage.getItem('user') && localStorage.getItem('password')) {
                    this.httpService.Login(localStorage.getItem('user'), localStorage.getItem('password')).then((res) => {
                        if (res == true) {
                            resolve(true);
                        }
                        else {
                            this.router.navigate(['/login']);
                            resolve(false);
                        }
                    })
                }
                else{
                    resolve(false)
                }
            });
        } catch (error) {

        }
    }
}