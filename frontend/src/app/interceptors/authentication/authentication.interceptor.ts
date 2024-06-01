import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { LoginService } from '../../services/login/login.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(
        private loginService: LoginService,
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next
            .handle(
                request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${this.loginService.getJwt()}`,
                    },
                })
            )
            .pipe(
                catchError(
                    (error) => {
                        if(error.status == 401)
                            this.loginService.resetJwt();

                        throw error;
                    }
                )
            );
    }
}
