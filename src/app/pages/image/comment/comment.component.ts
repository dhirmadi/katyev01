// src/app/pages/image/comment/comment.component.ts
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { CommentModel } from './../../../core/models/comment.model';
import { Subscription } from 'rxjs/Subscription';
// import { expandCollapse } from './../../../core/expand-collapse.animation';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  // animations: ['expandCollapse']
})
export class CommentComponent implements OnInit {
  @Input() imageId: string;
  @Input() imagePast: boolean;
  commentsSub: Subscription;
  userNameSub: Subscription;
  comments: CommentModel[];
  loading: boolean;
  error: boolean;
  userComment: CommentModel;
  userName: string;
//  totalAttending: number;
//  footerTense: string;
  showAllComments = false;
  showCommentsText = 'View all opinions';
  showEditForm = false;
  editBtnText = 'Edit my comment';

  constructor(
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    public fs: FilterSortService) { }

  ngOnInit() {
    // this.footerTense = !this.imagePast ? 'plan to attend this image.' : 'attended this image.';
    this._getComments();
    this.toggleEditForm(false);
  }

public writeCommenterName(userId: string) {
    this._getUserName(userId);
    return this.userName;
}
  private _getUserName(userId: string) {
      this.loading = true;
      console.log(userId);
    // GET username by userId
    this.userNameSub = this.api
      .getUserName$(userId)
      .subscribe(
        res => {
          this.userName = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }
    private _getComments() {
    this.loading = true;
    // Get Comments by image ID
    this.commentsSub = this.api
      .getCommentsByImageId$(this.imageId)
      .subscribe(
        res => {
          this.comments = res;
            console.log(this.comments);
          this._updateCommentState();
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  toggleShowComments() {
    this.showAllComments = !this.showAllComments;
    this.showCommentsText = this.showAllComments ? 'Hide opinions' : 'Show All Opinions';
  }


  onSubmitComment(e) {

    if (e.comment) {
      this.userComment = e.comment;
      this._updateCommentState(true);
      this.toggleEditForm(false);
    }
  }

  toggleEditForm(setVal?: boolean) {
    this.showEditForm = setVal !== undefined ? setVal : !this.showEditForm;
    this.editBtnText = this.showEditForm ? 'Cancel Edit' : 'Edit my opinion';
  }

  private _updateCommentState(changed?: boolean) {
    // If Comment matching user ID is already
    // in Comment array, set as initial Comment
    const _initialUserComment = this.comments.filter(comment => {
        return comment.userId === this.auth.userProfile.sub;
      })[0];

    // If user has not Commented before and has made
    // a change, push new Comment to local Comments store
    if (!_initialUserComment && this.userComment && changed) {
      this.comments.push(this.userComment);
    }
    this._setUserComment(changed);
  }

  private _setUserComment(changed?: boolean) {
    // Iterate over Comments to get/set user's Comment
    // and get total number of attending guests
   //   let attending = 0;
    const commentArr = this.comments.map(comment => {
      // If user has an existing Comment
      if (comment.userId === this.auth.userProfile.sub) {
        if (changed) {
          // If user edited their Comment, set with updated data
          comment = this.userComment;
        } else {
          // If no changes were made, set userComment property
          // (This applies on ngOnInit)
          this.userComment = comment;
        }
      }

      return comment;
    });
    this.comments = commentArr;
  }
}
