// src/app/pages/my-profile/my-coments/my-comments.component.ts
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { CommentModel } from './../../../core/models/comment.model';
import { Subscription } from 'rxjs';
import { ImageModel } from './../../../core/models/image.model';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.component.html',
  styleUrls: ['./my-comments.component.css']
})
export class MyCommentsComponent implements OnInit, OnDestroy {

    @Input() userId: string;
    imageListSub: Subscription;
    imageList: ImageModel[];
    loading: boolean;
    error: boolean;

    constructor(
        public auth: AuthService,
        private api: ApiService,
        public fs: FilterSortService,
        public utils: UtilsService) { }

    ngOnInit() {
        this._getImageList();
    }

    // build list of images where user has commented on.
    private _getImageList() {
        this.loading = true;
        // Get images user has commented to
        this.imageListSub = this.api
            .getUserImages$(this.userId)
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
