// src/app/pages/my-profile/my-images/my-images.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../core/api.service';
import { AuthService } from './../../auth/auth.service';
import { UtilsService } from './../../core/utils.service';
import { ImageModel } from './../../core/models/image.model';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit, OnDestroy {
    @Input() imageId: string;
    @Input() feedId: string;
    @Input() verb: string;
    @Input() object: string;
    userNameSub: Subscription;
    imageLink: String;
    userName: String;
    imageSub: Subscription;
    image: ImageModel;
    loading: boolean;


  constructor(
    private api: ApiService,
    private auth: AuthService,
    public utils: UtilsService
    ) { }


  ngOnInit() {
      if (this.verb === 'comment' || this.verb === 'like') {
            const splitted = this.object.split(':', 2);
            this.imageId = splitted[1];
      }
      this._getCloudinaryImageId$(this.imageId);
      this._getUserNameFromFeedId$(this.feedId);
  }

    // get username of user  published stream
    _getUserNameFromFeedId$(feedId: string) {
        this.loading = true;
        feedId = feedId.replace('_', '|');
        if (feedId==this.auth.userProfile.sub){
            this.userName='You'
        }else{
        // GET username by Auth0userId
        this.userNameSub = this.api
            .getUserName$(feedId)
            .subscribe(
            res => {
                this.userName = res;
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );}
    }
    // get cloudinaryID for display of image
    _getCloudinaryImageId$(imageId: string) {
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
            }
        );
    }

    ngOnDestroy() {
        this.imageSub.unsubscribe();
        if(this.userNameSub) {this.userNameSub.unsubscribe();}
    }
}
