import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../core/api.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(
        private api: ApiService,
        public auth: AuthService) { }

  ngOnInit() {

  }

}
