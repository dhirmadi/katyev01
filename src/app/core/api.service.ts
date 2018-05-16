
// import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { catchError } from 'rxjs/operators';

import { ENV } from './env.config';
import { ImageModel } from './models/image.model';
import { CommentModel } from './models/comment.model';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

    // get user name based on login ID
  getUserName$(id: string) {
    //  console.log(`Getting ${ENV.BASE_API}user/name/${id}`);
        return this.http
            .get(`${ENV.BASE_API}user/name/${id}`, {
                headers: new HttpHeaders().set('Authorization', this._authHeader)
            })
            .pipe(
                catchError((error) => this._handleError(error))
            );
    }
  // GET list of public, future images
  getImages$(): Observable<ImageModel[]> {
    return this.http
      .get(`${ENV.BASE_API}images`)
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // GET all images - private and public (admin only)
  getAdminImages$(): Observable<ImageModel[]> {
    //  console.log(this._authHeader);
    return this.http
      .get(`${ENV.BASE_API}images/admin`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // GET an image by ID (login required)
  getImageById$(id: string): Observable<ImageModel> {
      // console.log(`Getting ${ENV.BASE_API}image/${id}`);
    return this.http
      .get(`${ENV.BASE_API}images/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );

  }

  // GET Comments by image ID (login required)
  getCommentsByImageId$(imageId: string): Observable<CommentModel[]> {
    return this.http
      .get(`${ENV.BASE_API}images/${imageId}/comments`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

    // POST new image (admin only)
  postImage$(image: ImageModel): Observable<ImageModel> {
      image.userId = this.auth.userProfile.sub;
      console.log(image);
    return this.http
      .post(`${ENV.BASE_API}image/new`, image, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // PUT existing image (admin only)
  editImage$(id: string, image: ImageModel): Observable<ImageModel> {
    return this.http
      .put(`${ENV.BASE_API}image/${id}`, image, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // DELETE existing image and all associated RSVPs (admin only)
  deleteImage$(id: string): Observable<any> {
    return this.http
      .delete(`${ENV.BASE_API}image/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

    // GET all images a specific user has commented to (login required)
  getUserImages$(userId: string): Observable<ImageModel[]> {
      console.log('GEtting all images a user has commented on.');
    return this.http
      .get(`${ENV.BASE_API}image/${userId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }


     // POST new comment (login required)
  postComment$(comment: CommentModel): Observable<CommentModel> {
    return this.http
      .post(`${ENV.BASE_API}comment/new`, comment, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // PUT existing comment (login required)
  editComment$(id: string, comment: CommentModel): Observable<CommentModel> {
    return this.http
      .put(`${ENV.BASE_API}comment/${id}`, comment, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // error handling
  private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    console.log(errorMsg);
    return errorMsg;
  }

}
