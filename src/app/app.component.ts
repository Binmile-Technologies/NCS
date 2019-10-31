import { Component, OnInit, Optional, Inject, ɵɵqueryRefresh, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicCRMInfo } from '../services/dynamicCRM'
import { environment } from 'src/environments/environment';
import { NEWSCRED_CONSTANTS } from 'src/config';
import { PlatformLocation } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  EntityName = ""
  APIKey = ""

  ngOnInit() {
    
    this.EntityName = this.dynamicCRMInfo.entity;

    if (environment.production) {
      this.dynamicCRMInfo.getAPIKey();
      this.APIKey = this.dynamicCRMInfo.apiKey;
    }
    else
      this.APIKey = NEWSCRED_CONSTANTS.authHeader;

    if (this.EntityName == 'contact') {
      if (this.APIKey != null && this.APIKey != "") {
        this.router.navigate(['/']);
      }
      else {
        this.router.navigate(['/apikey']);
      }
    }
    else if (this.EntityName == 'opportunity') {
      if (this.APIKey != null && this.APIKey != "") {
        this.router.navigate(['/']);
      }
      else {
        this.router.navigate(['/apikey']);
      }
    }
    else if (this.EntityName == 'account') {
      if (this.APIKey != null && this.APIKey != "") {
        this.router.navigate(['/analytics']);
      }
      else {
        this.router.navigate(['/apikey']);
      }
    }
  }



  constructor(private location:PlatformLocation,private router: Router, @Inject('dynamicCRMInfo') @Optional() private dynamicCRMInfo?: DynamicCRMInfo) {
    this.EntityName = dynamicCRMInfo.entity;
    this.APIKey = dynamicCRMInfo.apiKey;
  }
}
