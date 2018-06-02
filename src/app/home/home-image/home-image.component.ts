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
    userSub: Subscription;
    countSub: Subscription;
    counter: string;
    user: UserModel;
    loading: boolean;
    error: boolean;
    liked: boolean;

    constructor(
    public utils: UtilsService,
    private api: ApiService,
    private auth: AuthService) { }

    ngOnInit() {
        this.setUser$(this.image.userId);
    }

    // setting details for image owner
    public setUser$(auth0Id: string) {
        this.loading = true;
        this.userSub = this.api
        .getUserbyId$(auth0Id)
        .subscribe(
            res => {
                this.user = res[0];
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }

    // update access counter
    public accessImage() {
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
    public likeImage() {

    }
    // unlike the image
    public unlikeImage() {

    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

}
