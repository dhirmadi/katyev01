import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from './../core/api.service';
import { AuthService } from './../auth/auth.service';
import { UtilsService } from './../core/utils.service';
import { FilterSortService } from './../core/filter-sort.service';
import { Subscription } from 'rxjs';
import { ImageModel } from './../core/models/image.model';
import { UserModel } from './../core/models/user.model';
import { CloudinaryService } from './../core/cloudinary.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  pageTitle = 'Photography is art';
  imageListSub: Subscription;
  userSub: Subscription;
  user: UserModel;
  imageList: ImageModel[];
  loading: boolean;
  error: boolean;
  query: '';

 constructor(
    private title: Title,
    public utils: UtilsService,
    private api: ApiService,
    private auth: AuthService,
    public fs: FilterSortService,
    private cloudinaryService: CloudinaryService) { }

  ngOnInit() {
    if (this.auth.loggedIn) {
        this._setUser$();
    }
    this.title.setTitle(this.pageTitle);
    this._getImageList();
  }


    // setting details for user
    private _setUser$() {
        this.userSub = this.api
        .getUserbyId$(this.auth.userProfile.sub)
        .subscribe(
            res => {
                this.user = res[0];
            },
            err => {
                console.error(err);
            }
        );
    }

  private _getImageList() {
    this.loading = true;
    // Get future, public images
    this.imageListSub = this.api
      .getImages$()
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

  ngOnDestroy() {
    this.imageListSub.unsubscribe();
  }

}
