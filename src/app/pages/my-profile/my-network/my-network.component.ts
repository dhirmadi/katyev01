import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Title } from '@angular/platform-browser';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { CloudinaryService } from './../../../core/cloudinary.service';

import { StreamClientService } from './../../../core/stream.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { UserModel, UserRoles } from './../../../core/models/user.model';
import { ImageModel } from './../../../core/models/image.model';
import { StreamActivityModel } from './../../../core/models/streamactivity.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-network',
  templateUrl: './my-network.component.html',
  styleUrls: ['./my-network.component.css']
})
export class MyNetworkComponent implements OnInit, OnDestroy {
    pageTitle = 'My network actrivities';
    userSub: Subscription;
    streamSub: Subscription;
    streamActivtiy: StreamActivityModel[];
    streamresult: StreamActivityModel;
    feedId: string;
    loading: boolean;
    user: UserModel;
    @Input() userId: string;

    constructor(
        private route: ActivatedRoute,
        private title: Title,
        public auth: AuthService,
        private api: ApiService,
        private stream: StreamClientService,
        public fs: FilterSortService,
        public utils: UtilsService) { }

    ngOnInit() {
        this.title.setTitle(this.pageTitle);
        this._setUserbyId$(this.userId);
    }

       // retrieve record of profile based on auth0 ID passed down
    private _setUserbyId$(userId: string) {
        this.loading = true;
        this.userSub = this.api
        .getUserbyId$(userId)
        .subscribe(
            res => {
                this.user = res[0];
                this.loading = false;
                this.feedId = this.user.userId.replace('|', '_');
                this._getActivityStream$('timeline');
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }
        // get activities for profile displayed
    private _getActivityStream$(streamGroup: string) {
        this.loading = true;
        this.streamSub = this.api
        .getStreamActivity$(streamGroup, this.feedId)
        .subscribe(
            res => {
                this.streamActivtiy = res;
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
            }
        );
    }

    ngOnDestroy() {
    }

}
