// src/app/pages/admin/update-image/delete-image/delete-image.component.ts
import { Component, OnDestroy, Input } from '@angular/core';
import { ImageModel } from './../../../../core/models/image.model';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-image',
  templateUrl: './delete-image.component.html',
  styleUrls: ['./delete-image.component.css']
})
export class DeleteImageComponent implements OnDestroy {
  @Input() image: ImageModel;
  confirmDelete: string;
  deleteSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(
    private api: ApiService,
    private router: Router) { }

  removeImage() {
    this.submitting = true;
    // DELETE image by ID
    this.deleteSub = this.api
      .deleteImage$(this.image._id)
      .subscribe(
        res => {
          this.submitting = false;
          this.error = false;
          // If successfully deleted image, redirect to Admin
          this.router.navigate(['/my-profile']);
        },
        err => {
          console.error(err);
          this.submitting = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

}
