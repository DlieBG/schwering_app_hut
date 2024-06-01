import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private route: ActivatedRoute,
    ) {
        route.queryParams.subscribe(
            (queryParams) => {
                if (queryParams['jwt'])
                    this.setJwt(queryParams['jwt']);
            }
        );
    }

    getJwt(): string | null {
        return localStorage.getItem('schwering_app_jwt');
    }

    setJwt(jwt: string) {
        localStorage.setItem('schwering_app_jwt', jwt);
    }

    resetJwt() {
        localStorage.removeItem('schwering_app_jwt');
    }

}
