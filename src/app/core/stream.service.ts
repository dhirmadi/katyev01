import { Observable ,  Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { catchError } from 'rxjs/operators';

import { ENV } from './env.config';
import { ImageModel } from './models/image.model';
import { CommentModel } from './models/comment.model';
import { UserModel } from './models/user.model';
import { ApiService } from './api.service';
// import stream = require('getstream');
import * as stream from 'getstream';

import { StreamActivityModel } from './models/streamactivity.model';



@Injectable()
export class StreamClientService {
    client: stream.StreamClient;
    stream: StreamActivityModel[];
    FeedId: string;
    streamSub: Subscription;
    loading: boolean;


    constructor(
        private api: ApiService,
        private auth: AuthService
     ) {}


}
