
// import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { catchError } from 'rxjs/operators';

import { ENV } from './env.config';
import { ImageModel } from './models/image.model';
import { CommentModel } from './models/comment.model';
import { UserModel } from './models/user.model';
import { StreamActivityModel } from './models/streamactivity.model';

@Injectable()
export class ApiService {

    constructor(
        private http: HttpClient,
        private auth: AuthService) { }


     /*
    |--------------------------------------
    | Steam API Calls
    |--------------------------------------
    */
    // get token for specific feed
    getStreamToken(feedGroup: String, feedName: String) {
        return this.http
        .get(`${ENV.BASE_API}stream/${feedGroup}/${feedName}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }

    // get activity for specific feed
    getStreamActivity$(feedGroup: String, feedName: String): Observable<StreamActivityModel[]> {
        return this.http
        .get(`${ENV.BASE_API}stream/${feedGroup}/${feedName}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }

    /*
    |--------------------------------------
    | User API Calls
    |--------------------------------------
    */
    // GET user data of  own account
    getUser$(): Observable<UserModel> {
        return this.http
            .get(`${ENV.BASE_API}user/${this.auth.userProfile.sub}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // GET user data of specific account
    getUserbyId$(id: string): Observable<UserModel> {
        return this.http
            .get(`${ENV.BASE_API}user/${id}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // PUT existing user (only self)
    editUser$(id: string, user: UserModel): Observable<UserModel> {
    return this.http
      . put(`${ENV.BASE_API}user/${id}`, user, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // POST new image (admin only)
    postUser$(user: UserModel): Observable<UserModel> {
      user.userId = this.auth.userProfile.sub;
    return this.http
      .post(`${ENV.BASE_API}user/new`, user, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
    }
    /*
    |--------------------------------------
    | Auth0 API Calls
    |--------------------------------------
    */
    // get user identity token based on login ID
    getUserIdentity$(id: string) {
        return this.http
        .get(`${ENV.BASE_API}user/identity/${id}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // get user name based on login ID
    getUserName$(id: string) {
        return this.http
        .get(`${ENV.BASE_API}user/name/${id}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    /*
    |--------------------------------------
    | Images API Calls
    |--------------------------------------
    */
    // GET list of  images marked as online
    getImages$(): Observable<ImageModel[]> {
    return this.http
        .get(`${ENV.BASE_API}images`)
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // GET all images - private and public (admin only)
    getAdminImages$(): Observable<ImageModel[]> {
    return this.http
      .get(`${ENV.BASE_API}images/admin`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }
    // GET an image by cloudinary ID (login required)
    getImageById$(link: string): Observable<ImageModel> {
    return this.http
      .get(`${ENV.BASE_API}images/${link}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );

  }
    // GET an images that belong to specific userId
    getImagesByUserId$(userId: string): Observable<ImageModel[]> {
    return this.http
        .get(`${ENV.BASE_API}images/user/${userId}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // POST new image (admin only)
    postImage$(image: ImageModel): Observable<ImageModel> {
      image.userId = this.auth.userProfile.sub;
    return this.http
        .post(`${ENV.BASE_API}image/new`, image, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // PUT update existing image
    editImage$(id: string, image: ImageModel): Observable<ImageModel> {
    return this.http
      . put(`${ENV.BASE_API}image/${id}`, image, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }

    // update clickCounter for image
    putImageClickCounter(id: string) {
    return this.http
      .get(`${ENV.BASE_API}image/counter/${id}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // like image
    likeImage(id: string, userId: string) {
    return this.http
      .get(`${ENV.BASE_API}image/like/${id}/${userId}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // unlike image
    unlikeImage(id: string, userId: string) {
    return this.http
      .get(`${ENV.BASE_API}image/unlike/${id}/${userId}`, {
            headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .pipe(
            catchError((error) => this._handleError(error))
        );
    }
    // unlike image
    getUserLikesImage(id: string, userId: string) {
    return this.http
      .get(`${ENV.BASE_API}image/liked/${id}/${userId}`, {
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
        return this.http
            .get(`${ENV.BASE_API}image/${userId}`, {
                headers: new HttpHeaders().set('Authorization', this._authHeader)
            })
                .pipe(
                catchError((error) => this._handleError(error))
            );
        }

    /*
    |--------------------------------------
    | Comment API Calls
    |--------------------------------------
    */
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

    /*
    |--------------------------------------
    | Internal Functions
    |--------------------------------------
    */
    // return access token
    private get _authHeader(): string {
        return `Bearer ${localStorage.getItem('access_token')}`;
    }
    // error handling
    private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return errorMsg;
  }

}
