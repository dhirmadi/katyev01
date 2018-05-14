import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-image',
  templateUrl: './create-image.component.html',
  styleUrls: ['./create-image.component.css']
})
export class CreateImageComponent implements OnInit {
    pageTitle = 'Create Image';

  constructor(private title: Title) { }

  ngOnInit() {
      this.title.setTitle(this.pageTitle);
  }

}
