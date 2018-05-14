import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from './../core/api.service';
import { UtilsService } from './../core/utils.service';
import { FilterSortService } from './../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { ImageModel } from './../core/models/image.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  pageTitle = 'Photography is art';
  imageListSub: Subscription;
  imageList: ImageModel[];
  filteredImages: ImageModel[];
  loading: boolean;
  error: boolean;
  query: '';

 constructor(
    private title: Title,
    public utils: UtilsService,
    private api: ApiService,
    public fs: FilterSortService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getImageList();
  }

  private _getImageList() {
    this.loading = true;
    // Get future, public images
    this.imageListSub = this.api
      .getImages$()
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
    this.imageListSub.unsubscribe();
  }

}
