// src/app/pages/my-rsvps/my-rsvps.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { ImageModel } from './../../core/models/image.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit, OnDestroy {
  pageTitle = 'My Profile';
  imageListSub: Subscription;
  imageList: ImageModel[];
  loading: boolean;
  error: boolean;
  userIdp: string;

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public fs: FilterSortService,
    public utils: UtilsService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.userIdp = this._getIdp;
    this._getImageList();
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

  private get _getIdp(): string {
    const sub = this.auth.userProfile.sub.split('|')[0];
    let idp = sub;

    if (sub === 'auth0') {
      idp = 'Username/Password';
    } else if (idp === 'google-oauth2') {
      idp = 'Google';
    } else {
      idp = this.utils.capitalize(sub);
    }
    return idp;
  }

  ngOnDestroy() {
    this.imageListSub.unsubscribe();
  }

}
