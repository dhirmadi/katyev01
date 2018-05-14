// src/app/pages/admin/update-image/update-image.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ImageModel } from './../../../core/models/image.model';

@Component({
  selector: 'app-update-image',
  templateUrl: './update-image.component.html',
  styleUrls: ['./update-image.component.css']
})
export class UpdateImageComponent implements OnInit, OnDestroy {
  pageTitle = 'Update Image';
  routeSub: Subscription;
  imageSub: Subscription;
  image: ImageModel;
  loading: boolean;
  error: boolean;
  private _id: string;
  tabSub: Subscription;
  tab: string;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);

    // Set image ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this._getImage();
      });

    // Subscribe to query params to watch for tab changes
    this.tabSub = this.route.queryParams
      .subscribe(queryParams => {
        this.tab = queryParams['tab'] || 'edit';
      });
  }

  private _getImage() {
    this.loading = true;
    // GET image by ID
    this.imageSub = this.api
      .getImageById$(this._id)
      .subscribe(
        res => {
          this.image = res;
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
    this.routeSub.unsubscribe();
    this.imageSub.unsubscribe();
    this.tabSub.unsubscribe();
  }

}
