import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
// import stream = require('getstream');
import * as stream from 'getstream';

import { StreamActivity } from './models/stream.model';
const APP_TOKEN = 'rvu8y2axaaab';
const APP_ID = '37789';



@Injectable()
export class StreamClientService {
  client: stream.Client;

  constructor(
     private api: ApiService
     ) {
    // Instantiate a new client (client side)
    this.client = stream.connect(APP_TOKEN, null, APP_ID);
  }

  getFeed(feedGroup: string, userId: string): Promise<StreamActivity[]> {
    //get token for feed
    const token= this.api.getStreamToken(feedGroup,userId);
    // Instantiate the feed via factory method
    var feed = this.client.feed('user', 'Evert', token);
    // Fetch the feed and pick the results property off the response object
    return feed.get().then(response => response['results']);
  }

}
