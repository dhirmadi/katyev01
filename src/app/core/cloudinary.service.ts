import {Injectable} from '@angular/core';
//import {Response} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PhotoModel} from './models/photo.model';
import {Cloudinary} from '@cloudinary/angular-5.x';

@Injectable()
export class CloudinaryService {

    constructor(private http: HttpClient, private cloudinary: Cloudinary) {
    }

    getMyPhotos(userId: string): Observable<PhotoModel[]> {
        // retuns a list of images which are tagged by the user login id tag.
        const url = this.cloudinary.url(userId, {
            format: 'json',
            type: 'list',
            // cache bust (lists are cached by the CDN for 1 minute)
            // *************************************************************************
            // Note that this is practice is DISCOURAGED in production code and is here
            // for demonstration purposes only
            // *************************************************************************
            version: Math.ceil(new Date().getTime() / 1000)
        });

        return this.http
            .get(url)
            .pipe(map((data: any) => data.resources));
    }
}
