import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from './../../core/api.service';
import { AuthService } from './../../auth/auth.service';
import { UtilsService } from './../../core/utils.service';
import { UserService } from './../../core/user.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs';
import { ImageModel } from './../../core/models/image.model';
import { ImageLikesModel } from './../../core/models/imageLikes.model';
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
            imageLiked: ImageLikesModel[];
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
    private auth: AuthService,
    private users: UserService) { }

    ngOnInit() {
        this.loading = true;
        if (this.auth.loggedIn) {
            this.setImageUser$(this.image.userId);
        }
    }

    // toggle display of image details
    public showImageDetail(show: boolean) {
        this.detail = show;
        if (show && this.auth.loggedIn) {
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
        this.image.likes += 1;

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
        this.image.likes -= 1;
    }

    ngOnDestroy() {
        if (this.imageUserSub) {this.imageUserSub.unsubscribe(); }
        if (this.userSub) {this.userSub.unsubscribe(); }
        if (this.countSub) {this.countSub.unsubscribe(); }
        if (this.likeSub) {this.likeSub.unsubscribe(); }
        if (this.unlikeSub) {this.unlikeSub.unsubscribe(); }
    }

}
