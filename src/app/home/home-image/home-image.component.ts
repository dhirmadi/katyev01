import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from './../../core/api.service';
import { AuthService } from './../../auth/auth.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { ImageModel } from './../../core/models/image.model';
import { UserModel } from './../../core/models/user.model';

@Component({
  selector: 'app-home-image',
  templateUrl: './home-image.component.html',
  styleUrls: ['./home-image.component.css']
})
export class HomeImageComponent implements OnInit, OnDestroy {
    @Input() image: ImageModel;
    @Input() viewer?: UserModel;

            userSub: Subscription;
            imageLikedSub: Subscription;
            imageLiked: string;
            imageUserSub: Subscription;
            countSub: Subscription;
            likeSub: Subscription;
            unlikeSub: Subscription;
            counter: string;
            likes: string;
            imageuser: UserModel;
            user: UserModel;
            loading: boolean;
            error: boolean;
            liked: boolean;
            detail: boolean;

    constructor(
    public utils: UtilsService,
    private api: ApiService,
    private auth: AuthService) { }

    ngOnInit() {
        this.setImageUser$(this.image.userId);
        if (this.auth.userProfile.sub) {
//            this._getUserLikeStatus$();
        }
    }

    // toggle display of image details
    public showImageDetail(show: boolean) {
        this.detail = show;
        if (show) {
            this._getUserLikeStatus$();
        }
    }
    // check if user has liked this image alread
    private _getUserLikeStatus$() {
        this.imageLikedSub = this.api
        .getUserLikesImage(this.image._id, this.viewer._id)
        .subscribe(
            res => {
                this.imageLiked = res;
                if (this.imageLiked[0]) {
                    this.liked = true;
                } else {
                    this.liked = false;
                }
            },
            err => {
                console.error(err);
            }
        );
    }
    // setting details for image owner
    public setImageUser$(auth0Id: string) {
        this.loading = true;
        this.imageUserSub = this.api
        .getUserbyId$(auth0Id)
        .subscribe(
            res => {
                this.imageuser = res[0];
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }
    // update access counter
    public accessImage$() {
        this.countSub = this.api
        .putImageClickCounter(this.image._id)
        .subscribe(
            res => {
                this.counter = res;
            },
            err => {
                console.error(err);
            }
        );
    }
    // like the image
    public likeImage$() {
        // add like action to user feed
        //  (todo check if user previously liked this image already and
        // if yes, do not add new event to avoid spamming)
        // add image to users liked images
        // add user to image's record for having liked it
        // increase number of likes and store user information
        this.likeSub = this.api
        .likeImage(this.image._id, this.viewer._id)
        .subscribe(
            res => {
                this.likes = res;
            },
            err => {
                console.error(err);
            }
        );
        this.liked = true;

    }
    // unlike the image
    public unlikeImage$() {
        this.unlikeSub = this.api
        .unlikeImage(this.image._id, this.viewer._id)
        .subscribe(
            res => {
                this.likes = res;
            },
            err => {
                console.error(err);
            }
        );
        this.liked = false;
    }

    ngOnDestroy() {
        if (this.imageUserSub) {this.imageUserSub.unsubscribe(); }
        if (this.userSub) {this.userSub.unsubscribe(); }
        if (this.countSub) {this.countSub.unsubscribe(); }
        if (this.likeSub) {this.likeSub.unsubscribe(); }
        if (this.unlikeSub) {this.unlikeSub.unsubscribe(); }
    }

}
