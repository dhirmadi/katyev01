import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Title } from '@angular/platform-browser';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { UserModel, UserRoles } from './../../../core/models/user.model';

import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-user',
  templateUrl: './my-user.component.html',
  styleUrls: ['./my-user.component.css']
})
export class MyUserComponent implements OnInit {

    user: string;
    roles = UserRoles;
    userData: UserModel;
    pageTitle: String;
    userSub: Subscription;
    userForm: FormGroup;
    submitUserObj: UserModel;
    submitUserSub: Subscription;
    isEdit: boolean;
    error: boolean;
    submitting: boolean;

    constructor(
        private route: ActivatedRoute,
        private title: Title,
        public auth: AuthService,
        private api: ApiService,
        public fs: FilterSortService,
        public utils: UtilsService,
        private fb: FormBuilder
        ) {
        this._createForm();
    }

    ngOnInit() {
        if (this.auth.userProfile) {
            this.user = this.auth.userProfile;
        } else {
            this.auth.getProfile((err, profile) => {
            this.user = profile;
            });
        }
        this._getUser();

    }
    // update record in the database
    onSubmit() {
    this.submitUserObj = this._getSubmitObj();
    this.submitUserSub = this.api
        .editUser$(this.userData._id , this.submitUserObj)
        .subscribe(
            data => this._handleSubmitSuccess(data),
            err => this._handleSubmitError(err)
        );
    }
    // post submission activities
    private _handleSubmitSuccess(res) {
        this.error = false;
        this.submitting = false;
        this.userForm.markAsPristine();
        this._getUser();
        // Redirect to image detail
        //    this.router.navigate(['/images', res._id]);
    }
    // handle submission errors
    private _handleSubmitError(err) {
        console.error(err);
        this.submitting = false;
        this.error = true;
    }
    // reset with initial data
    resetForm() {
        this._fillForm();
        this.userForm.markAsPristine();
    }
    // fill form with dato from database
    private _fillForm() {
        this.userForm.setValue({
        screenName : this.userData.screenName,
        location : this.userData.location,
        description : this.userData.description,
        avatar : this.userData.avatar,
        primaryRole : this.userData.primaryRole
        });
    }
    // build form for user data
    private _createForm() {
        this.userForm = this.fb.group({
            screenName: ['', Validators.required],
            location: ['', Validators.required],
            description: ['', Validators.required],
            avatar: ['', Validators.required],
            primaryRole: ['', Validators.required],
        });
    }
    // get information from database for user
    private _getUser() {
    // GET user by ID
    this.userSub = this.api
        .getUser$()
        .subscribe(
            res => {
                this.userData = res[0];
                this._setPageTitle(this.userData.screenName);
                this._fillForm();
            },
            err => {
                console.error(err);
                this._setPageTitle('User Details');
            }
        );
    }
    // convert form data into a usermodel object
    private _getSubmitObj() {
        const formData = this.userForm.value;
        const saveUser: UserModel = {
            userId: this.userData.userId,
            screenName: formData.screenName,
            avatar: formData.avatar,
            primaryRole: formData.primaryRole,
            location: formData.location,
            createDate: this.userData.createDate,
            description: formData.description,
            _id: this.userData._id
        };
        console.log(saveUser);
        return saveUser;
    }
    // set page title
    private _setPageTitle(title: string) {
        this.pageTitle = title;
        this.title.setTitle(title);
    }
    // ubsubscribe fomr observalbles
    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
