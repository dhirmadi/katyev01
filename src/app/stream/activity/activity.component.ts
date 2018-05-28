// src/app/pages/my-profile/my-images/my-images.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
// import { CloudinaryService } from './../../core/cloudinary.service';
// import { Cloudinary } from '@cloudinary/angular-5.x';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { ImageModel } from './../../core/models/image.model';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
    @Input() imageId: string;
    @Input() feedId: string;
    @Input() verb: string;
    @Input() object: string;
    pageTitle: String;
    userNameSub: Subscription;
    user: any;
    imageLink: String;
    userName: String;
    imageSub: Subscription;
    image: ImageModel;
    isEdit: boolean;
    error: boolean;
    loading: boolean;


  constructor(
    private route: ActivatedRoute,
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public fs: FilterSortService,
    public utils: UtilsService
    ) { }


  ngOnInit() {
      this.error = false;
      if (this.verb === 'comment') {
            const splitted = this.object.split(':', 2);
            this.imageId = splitted[1];
      }
      this._getCloudinaryImageId(this.imageId);
      this._getUserNameFromFeedId(this.feedId);
  }

    // get username of user  published stream
    _getUserNameFromFeedId(feedId: string) {
        this.loading = true;
        feedId = feedId.replace('_', '|');
        // GET username by userId
        this.userNameSub = this.api
            .getUserName$(feedId)
            .subscribe(
            res => {
                this.userName = res;
                this.loading = false;
                this.error = false;
            },
            err => {
                console.error(err);
                this.loading = false;
                this.error = true;
            }
        );
    }
    // get cloudinaryID for display of image
    _getCloudinaryImageId(imageId: string) {
        this.loading = true;
        this.imageSub = this.api
        .getImageById$(imageId)
        .subscribe(
            res => {
                this.image = res;
                this.imageLink = this.image.link;
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
                this.error = true;
            }
        );
        //        console.log(this.image);
//        return this.image.link;
    }
}
