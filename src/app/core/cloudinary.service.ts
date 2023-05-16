import {Injectable} from '@angular/core';
//import {Response} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PhotoModel} from './models/photo.model';
import { CloudinaryImage, Cloudinary } from '@cloudinary/url-gen';

@Injectable()
export class CloudinaryService {
  private cloudinary: Cloudinary;

  constructor(private http: HttpClient) {
    this.cloudinary = new Cloudinary({ cloud: { cloudName: 'your_cloud_name' } }); // Replace 'your_cloud_name' with your actual Cloudinary cloud name
  }

  getMyPhotos(userId: string): Observable<PhotoModel[]> {
    const url = `https://res.cloudinary.com/your_cloud_name/image/list/${userId}.json`; // Replace 'your_cloud_name' with your actual Cloudinary cloud name

    return this.http
      .get(url)
      .pipe(map((data: any) => data.resources));
  }
}




