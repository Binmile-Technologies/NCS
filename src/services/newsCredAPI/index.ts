import { Injectable, Optional, Inject } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {CustomHttpClient} from '../http.service';
import {DynamicCRMInfo} from '../dynamicCRM';
import { ArticleCategories } from '../../app/model/ArticleCategories';
import { promise } from 'protractor';
import { catchError } from 'rxjs/operators';
import { url } from 'inspector';
//import { currentId } from 'async_hooks';
declare var $:any
@Injectable({
  providedIn: 'root'
})
export class NewsCredAPI{
  recordId:number
  currentUserID:number
  validapikeystatus : string
  static getContactIdEndpoint = "v1/salesforce/contacts"
  static getLoggedInUserEndpoint = "v1/salesforce/users"
  static getFieldNameEndpoint = "v1/salesforce/contacts/field_names"

  static articleEndpoint = "v2/articles/recommendation"
  static articleCategoryEndpoint = "v1/categories/articles"
  static categoryEndpoint = "v1/categories"
  static recommendedArticlesEndpoint = "v2/articles/recommendation"
  static searchEndpoint = "v1/articles/search"
  static usedArticleEndpoint="v1/articles"
  static getEmailTemplateEndpoint="v1/users"
  static getEngagementContactsEndpoint="v1/salesforce/accounts/engagement/contact"
  static getEngagementUniqueContentEndpoint="v1/salesforce/accounts/engagement/unique-content"
  static getEngagementCtrEndpoint="v1/salesforce/accounts/engagement/ctr"
  static getContactsAnalyticsEndpoint="v1/salesforce/accounts/contact-analytics"
  static getContentAnalyticsEndpoint = "v1/salesforce/accounts/content-analytics"
  static getContactDetailsEndpoint = "v1/salesforce/accounts/contact-analytics/contact_Id/details"

  fields=[]
  public getRecommendedArticles(recordId:number, currentUserID:number):Observable<any>{
    const field_values = {"fieldName":"Contact.Title"};
    let url = `${this.newsCredConstants.baseUrl}/${NewsCredAPI.recommendedArticlesEndpoint}`
    let params = {
      account: this.dynamicCRMInfo.defaultData.contact.accountName,
      ...field_values,
      industry: this.dynamicCRMInfo.defaultData.contact.industry,
      record_id: recordId,
      user_id: currentUserID
    }
    return  this.httpClient.get(url, params);
  }

  public getContentLibraryArticles(category: ArticleCategories):Observable<any>{
    let params = {
      guid: category.guid
    }
    let url = `${this.newsCredConstants.baseUrl}/${NewsCredAPI.articleCategoryEndpoint}`
    return  this.httpClient.get(url, params);
  }

public getCategories():Observable<any>{
  let url = `${this.newsCredConstants.baseUrl}/${NewsCredAPI.categoryEndpoint}`
  let params = {
    email: this.dynamicCRMInfo.defaultData.currentUserEmail
  }
  return  this.httpClient.get(url,params);
}

//Get Contact Details Analytics
public getContactDetails(id):Observable<any>{
  var endpoint = NewsCredAPI.getContactDetailsEndpoint.replace('contact_Id',id);
  let url=`${this.newsCredConstants.baseUrl}/${endpoint}`
  let params = {
   
  }
  var res = this.httpClient.get(url,params);
  return this.httpClient.get(url,params);
}

public searchArticles(query: string):Observable<any>{
  let url = `${this.newsCredConstants.baseUrl}/${NewsCredAPI.searchEndpoint}`
  let params = {
    contact_email: this.dynamicCRMInfo.defaultData.contact.email,
    query,
    user_email: this.dynamicCRMInfo.defaultData.currentUserEmail
  }
  return this.httpClient.get(url, params)
}

// - fetching the contact id from NewsCred
public getRecordIdFromNewsCred():Promise<any>{
 let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getContactIdEndpoint}/${this.dynamicCRMInfo.defaultData.contact.id}`
 let params = {
  contact_email: this.dynamicCRMInfo.defaultData.contact.email,
  contact_name: this.dynamicCRMInfo.defaultData.contact.name
    }
 return this.httpClient.get(url, params).toPromise();
}

// - Getting current loggedIn user Id from NewsCred
public getCurrentUserIdFromNewsCred():Promise<any>{
let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getLoggedInUserEndpoint}/${this.dynamicCRMInfo.defaultData.currentUserEmail}`
return this.httpClient.get(url,"").toPromise()
}

// - Getting fields Name from the NewsCred
public getFieldNames(){
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getFieldNameEndpoint}`
  this.httpClient.get(url,"")
  .subscribe((data)=>{
   this.fields=data["names"];
  });
}



// - Posting the is used api to the newsCred on click on copy content...
public postUsedArticle(articleGuid:string, recordId:number, userId:number){
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.usedArticleEndpoint}/${articleGuid}/used`
  let body={
    "record_id":recordId,
    "user_id":userId
  }
  return this.httpClient.post(url, body)
}

//Get Engagement Contacts Analytics
public getEngagementContacts(){
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getEngagementContactsEndpoint}`
  let body= this.dynamicCRMInfo.GetContactDetailsForAccountAnalytics();
  return this.httpClient.post(url, body)
}

//Get Engagement CTr Analytics
public getEngagementCtr(){
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getEngagementCtrEndpoint}`
  let body= this.dynamicCRMInfo.GetContactDetailsForAccountAnalytics();
  
  return this.httpClient.post(url, body)
}

//Get Engagement Unique Content Analytics
public getEngagementUniqueContent(){
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getEngagementUniqueContentEndpoint}`
  let body= this.dynamicCRMInfo.GetContactDetailsForAccountAnalytics();
  return this.httpClient.post(url, body)
}


//Get Contact Tab Analytics
public getContactsAnalytics(){
  
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getContactsAnalyticsEndpoint}`
  let body= this.dynamicCRMInfo.GetContactDetailsForAccountAnalytics();
  
  return this.httpClient.post(url, body)
}

//Get Content Tab Analytics
public getContentAnalytics(){
  
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getContentAnalyticsEndpoint}`
  let body= this.dynamicCRMInfo.GetContactDetailsForAccountAnalytics();
  return this.httpClient.post(url, body);
}

public getLastSavedEmailTemplate(userId){
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getEmailTemplateEndpoint}/${userId}/email_templates`;
  return this.httpClient.get(url, "");
}

public saveDefaultEmailTemplate(userId, defaultEmailTemplate)
{
  let url=`${this.newsCredConstants.baseUrl}/${NewsCredAPI.getEmailTemplateEndpoint}/${userId}/email_templates`;
  let body={"template":defaultEmailTemplate};
  return this.httpClient.post(url, body);
}

  constructor(private httpClient: CustomHttpClient, @Inject('newsCredConstants') @Optional() private newsCredConstants?: any, @Inject('dynamicCRMInfo') @Optional() private dynamicCRMInfo?: DynamicCRMInfo) { 
  }

}
