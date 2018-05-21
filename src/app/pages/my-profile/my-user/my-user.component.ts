import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-user',
  templateUrl: './my-user.component.html',
  styleUrls: ['./my-user.component.css']
})
export class MyUserComponent implements OnInit {

        user: any;

    constructor(
        private route: ActivatedRoute,
        private title: Title,
        public auth: AuthService,
        private api: ApiService,
        public fs: FilterSortService,
        public utils: UtilsService) { }

    ngOnInit() {
        if (this.auth.userProfile) {
            this.user = this.auth.userProfile;
        } else {
            this.auth.getProfile((err, profile) => {
            this.user = profile;
            });
        }
                    console.log(this.user);
    }
}
