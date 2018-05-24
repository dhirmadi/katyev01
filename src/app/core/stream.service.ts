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
    feed:any;

  constructor(
     private api: ApiService
     ) {
    // Instantiate a new client (client side)
    this.client = stream.connect(APP_TOKEN, null, APP_ID);
  }


}
