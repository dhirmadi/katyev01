// src/app/pages/image/comment/comment-form/comment-form.component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from './../../../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../../core/api.service';
import { CommentModel } from './../../../../core/models/comment.model';
//import { LIKES_REGEX } from './../../../../core/forms/formUtils.factory';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit, OnDestroy {
  @Input() imageId: string;
  @Input() comment: CommentModel;
  @Output() submitComment = new EventEmitter();
//  LIKES_REGEX = LIKES_REGEX;
  isEdit: boolean;
  formComment: CommentModel;
  submitCommentSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(
    private auth: AuthService,
    private api: ApiService) { }

  ngOnInit() {
    this.isEdit = !!this.comment;
    this._setFormComment();
  }

  private _setFormComment() {
    if (!this.isEdit) {
      // If creating a new comment,
      // create new CommentModel with default data
      this.formComment = new CommentModel(
        this.auth.userProfile.sub,
        this.imageId);
    } else {
      // If editing an existing comment,
      // create new CommentModel from existing data
      this.formComment = new CommentModel(
        this.auth.userProfile.sub,
        this.comment.imageId,
        this.comment.comment,
        this.comment._id
      );
    }
  }

  changeAttendanceSetLikes() {
//    // If attendance changed to no, set guests: 0
////    if (!this.formComment.attending) {
////      this.formComment.likes = 0;
////    }
  }

  onSubmit() {
    this.submitting = true;
    if (!this.isEdit) {
      this.submitCommentSub = this.api
        .postComment$(this.formComment)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitCommentSub = this.api
        .editComment$(this.comment._id, this.formComment)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    const imageObj = {
      isEdit: this.isEdit,
      comment: res
    };
    this.submitComment.emit(imageObj);
    this.error = false;
    this.submitting = false;
  }

  private _handleSubmitError(err) {
    const imageObj = {
      isEdit: this.isEdit,
      error: err
    };
    this.submitComment.emit(imageObj);
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

  ngOnDestroy() {
    if (this.submitCommentSub) {
      this.submitCommentSub.unsubscribe();
    }
  }

}
