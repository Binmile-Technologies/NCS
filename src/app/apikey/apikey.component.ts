import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ModalService } from '../modal';
import { read } from 'fs';
import { DynamicCRMInfo } from 'src/services/dynamicCRM';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { NEWSCRED_CONSTANTS } from 'src/config';
import { NewsCredAPI } from '../../services/newsCredAPI';
import { delay } from 'q';
import { ArticleCategories } from '../model/ArticleCategories';
import { Z_VERSION_ERROR } from 'zlib';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-apikey',
  templateUrl: './apikey.component.html',
  styleUrls: ['./apikey.component.scss']
})
export class ApikeyComponent implements OnInit {
  [x: string]: any;
  isModalShown: Boolean;
  APIKey: string;
  isError: Boolean = false;
  EntityName: string = "";
  ErrorMessage: string = "";
  categories: ArticleCategories[];
  constructor(private apiService: NewsCredAPI, public newscredApp: AppComponent, private router: Router, private modalService: ModalService, @Inject('dynamicCRMInfo') @Optional() private dynamicCRMInfo?: DynamicCRMInfo) {
    this.APIKey = "";

  }

  ngOnInit() {

    this.EntityName = this.dynamicCRMInfo.entity;
    if (environment.production) {
      this.dynamicCRMInfo.getAPIKey();
      this.APIKey = this.dynamicCRMInfo.apiKey;
    }
    else
      this.APIKey = NEWSCRED_CONSTANTS.authHeader;





    if (this.EntityName == 'account') {
      if (this.APIKey != undefined && this.APIKey != null && this.APIKey != "") {
        this.router.navigate(['/analytics']);
      }

    }

  }

  ngAfterViewInit() {
    this.modalService.open('analyticsapikey');
  }

  openmodal(id) {
    this.modalService.open(id);
  }

  saveApiKey() {
    var updateKey = (document.getElementById("inputkey") as HTMLInputElement).value;
    if (environment.production) {
      this.ValidAPIKey(updateKey)
      //var updateKey = (document.getElementById("inputkey") as HTMLInputElement).value;
      // if (this.ValidAPIKey(updateKey)) {

      //   this.dynamicCRMInfo.UpdateKey(this.dynamicCRMInfo.entity, updateKey);
      //   this.newscredApp.ngOnInit();
      // }
      // else {
      //   this.isError = true;
      //   this.ErrorMessage = NEWSCRED_CONSTANTS.InvalidAPIKey;
      // }

    }
    else {
      var updateKey = "8178c61b21134cadb5651ff2fc724caf"
      this.ValidAPIKey(updateKey)
    }
  }

  ValidAPIKey(updateKeyInput) {
    if (updateKeyInput == undefined || updateKeyInput == "") {
      this.isError = true;
      this.ErrorMessage = NEWSCRED_CONSTANTS.EmptyAPIKey;
    }
    else {
      var self = this;
      var env = environment;
      var updateKey = updateKeyInput;
      $.ajax({
        url: NEWSCRED_CONSTANTS.baseUrl + '/' + NewsCredAPI.getFieldNameEndpoint,
        method: 'GET',
        async: "false",
        contentType: "application/json; ",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'ABCM ' + updateKeyInput
        },

        success: function (result) {
          if (env.production) {
            self.dynamicCRMInfo.UpdateKey(updateKey);
            self.newscredApp.ngOnInit();
          }
          else {
            self.newscredApp.ngOnInit();
          }

        },

        error: function (err) {
          self.isError = true;
          self.ErrorMessage = NEWSCRED_CONSTANTS.InvalidAPIKey;

        }

      });



    }


  }


}
