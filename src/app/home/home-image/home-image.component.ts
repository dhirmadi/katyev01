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
    user: UserModel;
    loading: boolean;
    error: boolean;

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

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

}
