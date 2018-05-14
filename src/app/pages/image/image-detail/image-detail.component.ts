// src/app/pages/image/image-detail/image-detail.component.ts
import { Component, Input } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { UtilsService } from './../../../core/utils.service';
import { ImageModel } from './../../../core/models/image.model';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent {
  @Input() image: ImageModel;

  constructor(
    public utils: UtilsService,
    public auth: AuthService) { }

}
