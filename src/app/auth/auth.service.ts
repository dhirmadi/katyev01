// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Auth0Lock } from 'auth0-lock';
import { AUTH_CONFIG } from './auth.config';
import * as auth0 from 'auth0-js';
import { ApiService } from './../core/api.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';

@Injectable()
export class AuthService {
    // new instance of auth0 class to access auth0 server
    private _auth0 = new auth0.WebAuth({
        clientID: AUTH_CONFIG.CLIENT_ID,
        domain: AUTH_CONFIG.CLIENT_DOMAIN,
        responseType: 'token id_token',
        audience: AUTH_CONFIG.AUDIENCE,
        redirectUri: AUTH_CONFIG.REDIRECT,
        scope: 'openid profile'
    });

    userProfile: any;
    // Create a stream of logged in status to communicate throughout app
    loggedIn: boolean;
    loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
    // admin flag
    isAdmin: boolean;

    // Subscribe to token expiration stream
    refreshSub: Subscription;

    constructor(
        private router: Router) {
        // If authenticated, set local profile property
        // and update login status subject.
        // If not authenticated but there are still items
        // in localStorage, log out.
        const lsProfile = localStorage.getItem('profile');
        if (this.tokenValid) {
            this.userProfile = JSON.parse(lsProfile);
            this.isAdmin = localStorage.getItem('isAdmin') === 'true';
            this.setLoggedIn(true);
            this.scheduleRenewal();
        } else if (!this.tokenValid && lsProfile) {
            this.logout();
        }
    }

    // get profile information from auth0 server
    public getProfile(cb): void {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access Token must exist to fetch profile');
        }
        const self = this;
        this._auth0.client.userInfo(accessToken, (err, profile) => {
        if (profile) {
            self.userProfile = profile;
        }
        cb(err, profile);
        });
    }

    public setLoggedIn(value: boolean) {
        // Update login status subject
        this.loggedIn$.next(value);
        this.loggedIn = value;
    }

    public login(redirect?: string) {
        // Parse redirection information from login request.
        const _redirect = redirect ? redirect : this.router.url;
        localStorage.setItem('authRedirect', _redirect);
        // Auth0 authorize request
        this._auth0.authorize();
    }

    public handleAuth() {
        // When Auth0 hash parsed, get profile
        this._auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken) {
            window.location.hash = '';
            this._getProfile(authResult);
          } else if (err) {
              this._clearRedirect();
              this.router.navigate(['/']);
              console.error(`Error authenticating: ${err.error}`);
          }
        });
    }

    private _getProfile(authResult) {
        // Use access token to retrieve user's profile and set session
        this._auth0.client.userInfo(authResult.accessToken, (err, profile) => {
          if (profile) {
            this._setSession(authResult, profile);
            this.router.navigate([localStorage.getItem('authRedirect') || '/']);
            this._redirect();
            this._clearRedirect();
          } else if (err) {
            console.error(`Error authenticating: ${err.error}`);
          }
        });
    }

    private _setSession(authResult, profile?) {
        // Save session data and update login status subject
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
        // Set tokens and expiration in localStorage and props
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('expires_at', expiresAt);

        // localStorage.setItem('profile', JSON.stringify(profile));
        // this.userProfile = profile;
        // setting admin level
        // this.isAdmin = this._checkAdmin(profile);
        // localStorage.setItem('isAdmin', this.isAdmin.toString());

        // If initial login, set profile and admin information
        if (profile) {
            localStorage.setItem('profile', JSON.stringify(profile));
            this.userProfile = profile;
            this.isAdmin = this._checkAdmin(profile);
            localStorage.setItem('isAdmin', this.isAdmin.toString());
        }

        // Update login status in loggedIn$ stream
        this.setLoggedIn(true);

        // Schedule access token renewal
        this.scheduleRenewal();
    }

    private _checkAdmin(profile) {
        // Check if the user has admin role
        const roles = profile[AUTH_CONFIG.NAMESPACE] || [];
        return roles.indexOf('admin') > -1;
    }

    private _clearRedirect() {
        // Remove redirect from localStorage
        localStorage.removeItem('authRedirect');
    }

    private _redirect() {
        // Redirect with or without 'tab' query parameter
        // Note: does not support additional params besides 'tab'
        const fullRedirect = decodeURI(localStorage.getItem('authRedirect'));
        const redirectArr = fullRedirect.split('?tab=');
        const navArr = [redirectArr[0] || '/'];
        const tabObj = redirectArr[1] ? { queryParams: { tab: redirectArr[1] }} : null;

        if (!tabObj) {
            this.router.navigate(navArr);
        } else {
            this.router.navigate(navArr, tabObj);
        }
    }

    logout(noRedirect?: boolean) {
        // Ensure all auth items removed from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('profile');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('authRedirect');
        localStorage.removeItem('isAdmin');
        this._clearRedirect();

        // Reset local properties, update loggedIn$ stream
        this.userProfile = undefined;
        this.isAdmin = undefined;
        this.setLoggedIn(false);

        // Unschedule access token renewal
        this.unscheduleRenewal();

        // Return to homepage
        if (noRedirect !== true) {
            this.router.navigate(['/']);
        }
    }

    get tokenValid(): boolean {
        // Check if current time is past access token's expiration
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return Date.now() < expiresAt;
    }

    renewToken() {
        console.log('Asking to renew token');
        this._auth0.checkSession({},
          (err, authResult) => {
            if (authResult && authResult.accessToken) {
                this._setSession(authResult);
            } else if (err) {
                console.warn(`Could not renew token: ${err.errorDescription}`);
                // Log out without redirecting to clear auth data
                this.logout(true);
                // Log in again
                this.login();
            }
          }
        );
      }

    scheduleRenewal() {
        // If user isn't authenticated, do nothing
        if (!this.tokenValid) { return; }
        // Unsubscribe from previous expiration observable
        this.unscheduleRenewal();
        // Create and subscribe to expiration observable
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        const expiresIn$ = Observable.of(expiresAt).pipe(
          mergeMap(
            expires => {
              const now = Date.now();
              // Use timer to track delay until expiration
              // to run the refresh at the proper time
              return Observable.timer(Math.max(1, expires - now));
            }
          )
        );

        this.refreshSub = expiresIn$
          .subscribe(
            () => {
              this.renewToken();
              this.scheduleRenewal();
            }
        );
    }

    unscheduleRenewal() {
        if (this.refreshSub) {
            this.refreshSub.unsubscribe();
        }
    }
}
