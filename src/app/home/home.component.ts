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
  filteredImages: ImageModel[];
  loading: boolean;
  finished: boolean = false;
  error: boolean;
  page: number = -1;  //set to -1 so on inital run it starts ar 0
  query: '';

  // infinite scroll parameters
    throttle = 1000;
    scrollDistance = 1;
    scrollUpDistance = 1;
    direction = '';
    images=[];

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
    this.addImages();
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

    private _getImageList(page:number) {
        this.loading = true;
        // Get future, public images
        this.imageListSub = this.api
          .getImages$(page)
          .subscribe(
            res => {
              this.imageList = res;
              this.filteredImages = res;
              this.loading = false;
                for(var i in this.imageList){
                    this.images.push(this.imageList[i]);
                    console.log(this.images.length);
                    console.log(i);
                }
            },
            err => {
              console.error(err);
              this.loading = false;
              this.error = true;
            }
        );
    }

  searchImages() {
    this.filteredImages = this.fs.search(this.imageList, this.query, '_id', 'mediumDate');
  }

  resetQuery() {
    this.query = '';
    this.filteredImages = this.imageList;
  }

  ngOnDestroy() {
    this.imageListSub.unsubscribe();
  }

// infinite scroll functions
addImages() {
    console.log('scrolled down!!');
    this.page += 1;  //get next set of images
    this._getImageList(this.page); // get number of images
  }


}
