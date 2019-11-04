import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from './../../../../auth/auth.service';
import { ApiService } from './../../../../core/api.service';
import { UtilsService } from './../../../../core/utils.service';
import { UserService } from './../../../../core/user.service';
import { CommentModel } from './../../../../core/models/comment.model';
import { UserModel } from './../../../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.css']
})

export class CommentDetailComponent implements OnInit, OnDestroy {
    @Input() comment: CommentModel;
    loading: boolean;
    userSub: Subscription;
    user: UserModel;

    constructor(
        public api: ApiService,
        public auth: AuthService,
        public utils: UtilsService,
        ) { }

    ngOnInit() {
        this.setUser$(this.comment.userId);
    }
    // fetch user details as part of subscription.
    // TODO  idealy we use here the existing function from the user service, but need to find a way, to load it asynchonously
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

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

}
