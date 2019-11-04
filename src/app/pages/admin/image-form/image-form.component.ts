import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from './../../../core/api.service';
import { ImageModel, FormImageModel } from './../../../core/models/image.model';
import { DatePipe } from '@angular/common';
import { dateValidator } from './../../../core/forms/date.validator';
import { dateRangeValidator } from './../../../core/forms/date-range.validator';
import { DATE_REGEX, TIME_REGEX, stringsToDate } from './../../../core/forms/formUtils.factory';
import { ImageFormService } from './image-form.service';

@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.css'],
  providers: [ ImageFormService ]
})
export class ImageFormComponent implements OnInit, OnDestroy {
  @Input() image: ImageModel;
  isEdit: boolean;
  // FormBuilder form
  imageForm: FormGroup;
  datesGroup: AbstractControl;
  // Model storing initial form values
  formImage: FormImageModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitImageObj: ImageModel;
  submitImageSub: Subscription;
  error: boolean;
  submitting: boolean;
  submitBtnText: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private datePipe: DatePipe,
    public ef: ImageFormService,
    private router: Router) { }

  ngOnInit() {
    this.formErrors = this.ef.formErrors;
    this.isEdit = !!this.image;
    this.submitBtnText = this.isEdit ? 'Update Image' : 'Create Image';
    // Set initial form data
    this.formImage = this._setFormImage();
    // Use FormBuilder to construct the form
    this._buildForm();
  }

  private _setFormImage() {
    if (!this.isEdit) {
      // If creating a new image, create new
      // FormImageModel with default null data
      return new FormImageModel(null, null, null, null, null, null, null, null, null);
    } else {
      // If editing existing image, create new
      // FormImageModel from existing data
      // Transform datetimes:
      // https://angular.io/api/common/DatePipe
      // _shortDate: 1/7/2017
      // 'shortTime': 12:05 PM
      const _shortDate = 'yyyy/MM/dd';
      const _shortTime = 'hh:mm';
      return new FormImageModel(
        this.image.title,
        this.image.link,
        this.image.location,
        this.image.online,
        this.datePipe.transform(this.image.createDate, _shortDate),
        this.datePipe.transform(this.image.createDate, _shortTime),
        this.datePipe.transform(this.image.editDate, _shortDate),
        this.datePipe.transform(this.image.editDate, _shortTime),
        this.image.description
      );
    }
  }

  private _buildForm() {
    this.imageForm = this.fb.group({
      title: [this.formImage.title, [
        Validators.required,
        Validators.minLength(this.ef.textMin),
        Validators.maxLength(this.ef.titleMax)
      ]],
      link: [this.formImage.link, [
        Validators.required,
        Validators.minLength(this.ef.textMin),
        Validators.maxLength(this.ef.locMax)
      ]],
      location: [this.formImage.location, [
        Validators.required,
        Validators.minLength(this.ef.textMin),
        Validators.maxLength(this.ef.locMax)
      ]],
      online: [this.formImage.online,
        Validators.required
      ],
      description: [this.formImage.description,
        Validators.maxLength(this.ef.descMax)
      ],
      datesGroup: this.fb.group({
        createDate: [this.formImage.createDate, [
          Validators.required,
          Validators.maxLength(this.ef.dateMax),
          Validators.pattern(DATE_REGEX),
//          dateValidator()
        ]],
        startTime: [this.formImage.startTime, [
          Validators.required,
          Validators.maxLength(this.ef.timeMax),
          Validators.pattern(TIME_REGEX)
        ]],
        endDate: [this.formImage.editDate, [
          Validators.required,
          Validators.maxLength(this.ef.dateMax),
          Validators.pattern(DATE_REGEX),
          dateValidator()
        ]],
        endTime: [this.formImage.stopTime, [
          Validators.required,
          Validators.maxLength(this.ef.timeMax),
          Validators.pattern(TIME_REGEX)
        ]]
      }, { validator: dateRangeValidator })
    });
    // Set local property to imageForm datesGroup control
    this.datesGroup = this.imageForm.get('datesGroup');

    // Subscribe to form value changes
    this.formChangeSub = this.imageForm
      .valueChanges
      .subscribe(data => this._onValueChanged());

    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an image that is no
    // longer valid (for example, an image in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.imageForm);
      _markDirty(this.datesGroup);
    }

    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.imageForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.ef.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };

    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        if (field !== 'datesGroup') {
          // Set errors for fields not inside datesGroup
          // Clear previous error message (if any)
          this.formErrors[field] = '';
          _setErrMsgs(this.imageForm.get(field), this.formErrors, field);
        } else {
          // Set errors for fields inside datesGroup
          const datesGroupErrors = this.formErrors['datesGroup'];
          for (const dateField in datesGroupErrors) {
            if (datesGroupErrors.hasOwnProperty(dateField)) {
              // Clear previous error message (if any)
              datesGroupErrors[dateField] = '';
              _setErrMsgs(this.datesGroup.get(dateField), datesGroupErrors, dateField);
            }
          }
        }
      }
    }
  }

  private _getSubmitObj() {
    const createDate = this.datesGroup.get('createDate').value;
    const startTime = this.datesGroup.get('startTime').value;
    const endDate = this.datesGroup.get('endDate').value;
    const endTime = this.datesGroup.get('endTime').value;
    // Convert form createDate/startTime and endDate/endTime
    // to JS dates and populate a new ImageModel for submission
    return new ImageModel(
        this.imageForm.get('title').value,
        this.imageForm.get('link').value,
        this.imageForm.get('location').value,
        null,
        0,
        0,
        this.imageForm.get('online').value,
        stringsToDate(createDate, startTime),
        stringsToDate(endDate, endTime),
        this.imageForm.get('description').value,
        this.image ? this.image._id : null
    );
  }

  onSubmit() {
    this.submitting = true;
    this.submitImageObj = this._getSubmitObj();
    if (!this.isEdit) {
      this.submitImageSub = this.api
        .postImage$(this.submitImageObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitImageSub = this.api
        .editImage$(this.image._id, this.submitImageObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to image detail
    this.router.navigate(['/images', res._id]);
  }

  private _handleSubmitError(err) {
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

  resetForm() {
    this.imageForm.reset();
  }

  ngOnDestroy() {
    if (this.submitImageSub) {
      this.submitImageSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}
