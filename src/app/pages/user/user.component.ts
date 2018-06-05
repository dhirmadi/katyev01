import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { CloudinaryService } from './../../core/cloudinary.service';
import { UserService } from './../../core/user.service';

import { StreamClientService } from './../../core/stream.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { UserModel, UserRoles } from './../../core/models/user.model';
import { ImageModel } from './../../core/models/image.model';
import { StreamActivityModel } from './../../core/models/streamactivity.model';

import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
    userId: string;
    feedId: string;
    tab: string;
    user: UserModel;
    streamActivtiy: StreamActivityModel[];
    imageList: ImageModel[];
    filteredImages: ImageModel[];
    routeSub: Subscription;
    tabSub: Subscription;
    userSub: Subscription;
    streamSub: Subscription;
    imagesSub: Subscription;
    loading: boolean;
    query = '';


    constructor(
        private route: ActivatedRoute,
        private title: Title,
        public auth: AuthService,
        private api: ApiService,
        private stream: StreamClientService,
        public fs: FilterSortService,
        public utils: UtilsService
        ) { }

    ngOnInit() {
        // Set image ID from route params and subscribe
        this.routeSub = this.route.params
        .subscribe(params => {
            this.userId = params['id'];
            this.setUserbyId(this.userId);
        });
        // Subscribe to query params to watch for tab changes
        this.tabSub = this.route.queryParams
            .subscribe(queryParams => {
            this.tab = queryParams['tab'] || 'details';
        });

    }

    private _getImageList$(userId) {
        this.loading = true;
        // Get all images owned by uid
        this.imagesSub = this.api
          .getImagesByUserId$(userId)
          .subscribe(
            res => {
                this.imageList = res;
                this.filteredImages = res;
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
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

        // get activities for user
    getActivityStream$(streamGroup: string) {
        this.loading = true;
        this.streamSub = this.api
        .getStreamActivity$(streamGroup, this.feedId)
        .subscribe(
            res => {
                this.streamActivtiy = res;
                this.loading = false;
                this._getImageList$(this.user.userId);
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }
   // retrieve record of user based on internal ID
    public setUserbyId(userId: string) {
        this.loading = true;
        this.userSub = this.api
        .getUserbyinternalId$(userId)
        .subscribe(
            res => {
                this.user = res;
                this.loading = false;
                this.feedId = this.user.userId.replace('|', '_');
                this.getActivityStream$('user');
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }
    // ubsubscribe fomr observalbles
    ngOnDestroy() {
        this.routeSub.unsubscribe();
        this.streamSub.unsubscribe();
//        this.imageSub.unsubscribe();
    }

}
