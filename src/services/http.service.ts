import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';
import { Observable, throwError } from 'rxjs';
import { async } from '@angular/core/testing';
import { DynamicCRMInfo } from '../services/dynamicCRM';
import { environment } from 'src/environments/environment';
import { escapeRegExp } from '@angular/compiler/src/util';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CustomHttpClient {
  private commonHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',

  })

  EntityName: string;
  APIKey: string;
  constructor(private http: HttpClient, @Inject('newsCredConstants') @Optional() private newsCredConstants?: any, @Inject('dynamicCRMInfo') @Optional() private dynamicCRMInfo?: DynamicCRMInfo) {
    this.EntityName = dynamicCRMInfo.entity;
    this.APIKey = dynamicCRMInfo.apiKey;
  }


  getAuthorizationHeader() {
    if (!environment.production) {
      
      return this.newsCredConstants.authHeader;
    }
    else {
      this.dynamicCRMInfo.getAPIKey();
      this.APIKey =  this.dynamicCRMInfo.apiKey;
      return 'ABCM ' + this.APIKey;
    }

  }

  get(url: string, params: any) {
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': this.getAuthorizationHeader()
      }),
      params: params,
    });
  }

  post(url: string, body: any) {
    return this.http.post<any>(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': this.getAuthorizationHeader()
      }),
    })
  }





}