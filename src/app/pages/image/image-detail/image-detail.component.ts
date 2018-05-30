// src/app/pages/image/image-detail/image-detail.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { UtilsService } from './../../../core/utils.service';
import { UserService } from './../../../core/user.service';
import { ImageModel } from './../../../core/models/image.model';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements OnInit {
    @Input() image: ImageModel;
    @Input() userId: string;
    userName: string;


    constructor(
        public auth: AuthService,
        public utils: UtilsService,
        public user: UserService) { }

    ngOnInit() {
        this.user.setUser(this.userId);
    }
}
