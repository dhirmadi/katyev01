// src/app/pages/image/image.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ImageModel } from './../../core/models/image.model';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, OnDestroy {
  pageTitle: string;
  id: string;
  routeSub: Subscription;
  tabSub: Subscription;
  imageSub: Subscription;
  image: ImageModel;
  loading: boolean;
  error: boolean;
  tab: string;
  imagePast: boolean;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    private title: Title) { }

  ngOnInit() {
    // Set image ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getImage();
      });

    // Subscribe to query params to watch for tab changes
    this.tabSub = this.route.queryParams
      .subscribe(queryParams => {
        this.tab = queryParams['tab'] || 'details';
      });
  }

  private _getImage() {
    this.loading = true;
    // GET image by ID
    this.imageSub = this.api
      .getImageById$(this.id)
      .subscribe(
        res => {
          this.image = res;
          this._setPageTitle(this.image.title);
          this.loading = false;
          this.imagePast = this.utils.imagePast(this.image.stopDate);
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
          this._setPageTitle('Image Details');
        }
      );
  }

  private _setPageTitle(title: string) {
    this.pageTitle = title;
    this.title.setTitle(title);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.tabSub.unsubscribe();
    this.imageSub.unsubscribe();
  }

}
