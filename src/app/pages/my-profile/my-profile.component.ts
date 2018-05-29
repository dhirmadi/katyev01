// src/app/pages/my-profile/my-profile.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { ImageModel } from './../../core/models/image.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit, OnDestroy {
  pageTitle = 'My Profile';
  imageListSub: Subscription;
  tabSub: Subscription;
  identitySub: Subscription;
  identity: String;
  imageList: ImageModel[];
  loading: boolean;
  error: boolean;
  tab: string;
  userIdp: string;
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public fs: FilterSortService,
    public utils: UtilsService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getIdp();
    this._getAuth0Identity();
    // this._getImageList();

    // Subscribe to query params to watch for tab changes
    this.tabSub = this.route.queryParams
      .subscribe(queryParams => {
        this.tab = queryParams['tab'] || 'my-images';
      });
    this.loading = false;
  }

  private _getImageList() {
    this.loading = true;
    // Get images user has commented to
    this.imageListSub = this.api
      .getUserImages$(this.auth.userProfile.sub)
      .subscribe(
        res => {
          this.imageList = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  private _getIdp() {
    const sub = this.auth.userProfile.sub.split('|')[0];
    this.userId = this.auth.userProfile.sub;
    let idp = sub;

    if (sub === 'auth0') {
      idp = 'Username/Password';
    } else if (idp === 'google-oauth2') {
      idp = 'Google';
    } else {
      idp = this.utils.capitalize(sub);
    }
    this.userIdp = idp;
  }
       // get cloudinaryID for display of image
   private _getAuth0Identity() {
        this.loading = true;
        this.identitySub = this.api
        .getUserIdentity$(this.auth.userProfile.sub)
        .subscribe(
            res => {
                this.identity = res;
                console.log(this.identity);
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
                this.error = true;
            }
        );
    }

  ngOnDestroy() {
     //this.identitySub.unsubscribe();
     //this.imageListSub.unsubscribe();
  }

}
