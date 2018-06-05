import { Injectable } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { UserModel, UserRoles } from './models/user.model';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UserService {
    userData: UserModel;
    userSub: Subscription;
    auth0NameSub: Subscription;
    screenName: string;
    auth0Name: string;
    location: string;
    description: string;
    avatar: string;
    primaryRole: string;
    userId: string;
    auth0Id: string;
    feedId: string;
    loading: boolean;


    constructor(
        public auth: AuthService,
        public api: ApiService
         ) {}

    // retrieve record of user based on authentication ID
    public setUser(auth0Id: string) {
        this.loading = true;
        this.userSub = this.api
        .getUserbyId$(auth0Id)
        .subscribe(
            res => {
                this.userData = res[0];
                this._setauth0Name(auth0Id);
                this._setUserAttributes(auth0Id);
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }
    // retrieve record of user based on internal ID
    public setUserbyId(userId: string) {
        this.loading = true;
        this.userSub = this.api
        .getUserbyinternalId$(userId)
        .subscribe(
            res => {
                this.userData = res;
                console.log(this.userData);
                this._setauth0Name(this.userData.userId);
                this._setUserAttributes(this.userData.userId);
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }

    // set attributes of service
    private _setUserAttributes(auth0Id: string) {
        // adjusting if screen name was not set
        this.screenName = this.userData.screenName;
        this.location = this.userData.location;
        this.description = this.userData.description;
        this.avatar = this.userData.avatar;
        this.primaryRole = this.userData.primaryRole;
        this.userId = this.userData._id;
        this.auth0Id = auth0Id;
        this.feedId = auth0Id.replace('|', '_');
    }

    // get user name of auth0 user
    private _setauth0Name(auth0Id: string) {
        this.loading = true;
        this.auth0NameSub = this.api
        .getUserName$(auth0Id)
        .subscribe(
            res => {
                this.auth0Name = res;
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }

    public unsubscribe() {
        this.userSub.unsubscribe();
        this.auth0NameSub.unsubscribe();

    }

}
