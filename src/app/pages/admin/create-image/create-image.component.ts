import { Component, OnInit, Input, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { Subscription } from 'rxjs/Subscription';
import { ImageModel } from './../../../core/models/image.model';

@Component({
  selector: 'app-create-image',
  templateUrl: './create-image.component.html',
  styleUrls: ['./create-image.component.css']
})
export class CreateImageComponent implements OnInit {
    @Input()
    responses: Array<any>;

    private hasBaseDropZoneOver: boolean = false;
    private uploader: FileUploader;
    private userId: string;
    private image: ImageModel;
    private title: string;
    pageTitle = 'Upload new photos';
    submitImageSub: Subscription;
    error: boolean;
    submitting: boolean;


  constructor(
    public auth: AuthService,
    private api: ApiService,
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient,
    private pTitle: Title
    ) {
        this.responses = [];
        this.title = '';
    }

  ngOnInit(): void {
      this.userId = this.auth.userProfile.sub;
      this.pTitle.setTitle(this.pageTitle);
 // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = this.userId;
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `${this.userId},${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
//      form.append('folder', 'angular_sample');
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    // Insert or update an entry in the responses array
    const upsertResponse = fileItem => {

      // Run the update in a custom zone since for some reason change detection isn't performed
      // as part of the XHR request to upload the files.
      // Running in a custom zone forces change detection
      this.zone.run(() => {
        // Update an existing entry if it's upload hasn't completed yet

        // Find the id of an existing item
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          // Update existing item with new data
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
        } else {
          // Create new response
          this.responses.push(fileItem);
        }
      });
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        const data  = JSON.parse(response);
        this.image = this._getSubmitObj(data.public_id);
        this.submitImageSub = this.api
            .postImage$(this.image)
            .subscribe(
                data => this._handleSubmitSuccess(data),
                err => this._handleSubmitError(err)
            );
        };
}


  updateTitle(value: string) {
    this.title = value;
  }

  // Delete an uploaded image
  // Requires setting "Return delete token" to "Yes" in your upload preset configuration
  // See also https://support.cloudinary.com/hc/en-us/articles/202521132-How-to-delete-an-image-from-the-client-side-
    deleteImage = function (data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body, options).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.result}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties)
      .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  }

  private _getSubmitObj(public_id: string) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setFullYear(tomorrow.getFullYear() + 5);

    return new ImageModel(
        'Your Title',
        public_id,
        'Zurich',
        this.userId,
        0,
        true,
        today,
        tomorrow,
        'Your Description',
        this.image ? this.image._id : null
    );
  }


  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to image detail
  }

  private _handleSubmitError(err) {
    console.error(err);
    this.submitting = false;
    this.error = true;
  }
}
