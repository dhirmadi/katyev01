// katyev 01
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CloudinaryModule, CloudinaryConfiguration, provideCloudinary} from '@cloudinary/angular-5.x';
import * as cloudinary from 'cloudinary-core';
import {FileUploadModule} from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { HomeComponent } from './home/home.component';

 import { AuthService } from './auth/auth.service';
 import { AuthGuard } from './auth/auth.guard';
 import { AdminGuard } from './auth/admin.guard';

 import { ApiService } from './core/api.service';
 import { CloudinaryService } from './core/cloudinary.service';
 import { UtilsService } from './core/utils.service';
 import { FilterSortService } from './core/filter-sort.service';
 import { LoadingComponent } from './core/loading.component';
 import { SubmittingComponent } from './core/forms/submitting.component';

import { CallbackComponent } from './pages/callback/callback.component';
import { ImageComponent } from './pages/image/image.component';
import { ImageDetailComponent } from './pages/image/image-detail/image-detail.component';
import { CommentComponent } from './pages/image/comment/comment.component';
import { CommentFormComponent } from './pages/image/comment/comment-form/comment-form.component';

import { AdminComponent } from './pages/admin/admin.component';
import { CreateImageComponent } from './pages/admin/create-image/create-image.component';
import { UpdateImageComponent } from './pages/admin/update-image/update-image.component';
import { ImageFormComponent } from './pages/admin/image-form/image-form.component';
import { DeleteImageComponent } from './pages/admin/update-image/delete-image/delete-image.component';

import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { MyImagesComponent } from './pages/my-profile/my-images/my-images.component';
import { MyCommentsComponent } from './pages/my-profile/my-comments/my-comments.component';

import cloudinaryConfiguration from './cloudinary/cloudinary.default';

const appRoutes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'callback', component: CallbackComponent },
{ path: 'admin', canActivate: [ AuthGuard, AdminGuard ],
 children: [
     {path: '', component: AdminComponent },
     { path: 'image/new', component: CreateImageComponent },
     { path: 'image/update/:id', component: UpdateImageComponent },
 ]
},
{ path: 'images/:id', component: ImageComponent, canActivate: [ AuthGuard ] },
{ path: 'my-profile', component: MyProfileComponent, canActivate: [ AuthGuard ] },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CallbackComponent,
    LoadingComponent,
    AdminComponent,
    ImageComponent,
    ImageDetailComponent,
    CommentComponent,
    CommentFormComponent,
    SubmittingComponent,
    CreateImageComponent,
    UpdateImageComponent,
    ImageFormComponent,
    DeleteImageComponent,
    MyProfileComponent,
    MyImagesComponent,
    MyCommentsComponent,
  ],
  imports: [
      BrowserModule,
      RouterModule.forRoot(appRoutes),
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      CloudinaryModule.forRoot(cloudinary, cloudinaryConfiguration),
      FileUploadModule,
  ],
  providers: [
      Title,
      AuthService,
      AuthGuard,
      AdminGuard,
      ApiService,
      DatePipe,
      UtilsService,
      FilterSortService,
      CloudinaryService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
