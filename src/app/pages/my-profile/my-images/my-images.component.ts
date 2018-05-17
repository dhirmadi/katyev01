// src/app/pages/my-profile/my-images/my-images.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../../../auth/auth.service';
//import { CLOUD_CONFIG } from './../../../cloudinary/cloudinary.config';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { ImageModel } from './../../../core/models/image.model';
// import { PhotoModel } from './../../../core/models/photo.model';
// import { CloudinaryService } from './../../../core/cloudinary.service';

@Component({
  selector: 'app-my-images',
  templateUrl: './my-images.component.html',
  styleUrls: ['./my-images.component.css']
})
export class MyImagesComponent implements OnInit {

//    cloudName = CLOUD_CONFIG.CLOUD_NAME;
//    cloudUploadPreset = CLOUD_CONFIG.CLOUD_UPLOAD_PRESET;
    @Input() userId: string;

    imagesSub: Subscription;
    imageList: ImageModel[];
    filteredImages: ImageModel[];
    loading: boolean;
    error: boolean;
    query = '';
//    private photos: Observable<PhotoModel[]>;

    constructor(
//        private cloudinaryService: CloudinaryService,
        public auth: AuthService,
        private api: ApiService,
        public utils: UtilsService,
        public fs: FilterSortService
    ) { }

    ngOnInit() {
//        this.photos = this.cloudinaryService.getMyPhotos(this.userId);
        this._getImageList();
    }

    private _getImageList() {
        this.loading = true;
        // Get all images owned by uid
        this.imagesSub = this.api
          .getImagesByUserId$(this.userId)
          .subscribe(
            res => {
                this.imageList = res;
                this.filteredImages = res;
                this.loading = false;
            },
            err => {
                console.error(err);
                this.loading = false;
                this.error = true;
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

  ngOnDestroy() {
    this.imagesSub.unsubscribe();
  }

}
