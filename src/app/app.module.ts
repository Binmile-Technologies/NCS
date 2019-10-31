import { BrowserModule } from '@angular/platform-browser';
import { NgModule,ErrorHandler} from '@angular/core';
import {FormsModule} from '@angular/forms'


import{OwlModule} from 'ngx-owl-carousel';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecommendedContentComponent } from './recommended-content/recommended-content.component';
import { InTabLoader } from './components/spinner';
import { ArticleCard } from './components/card';
import { ArticleCardSlider } from './components/slider';
import { ContentLibraryComponent } from './content-library/content-library.component';
import { SearchComponent } from './search/search.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CustomHttpClient} from '../services/http.service'
import { NewsCredAPI } from '../services/newsCredAPI';
import { NEWSCRED_CONSTANTS } from '../config';
import {DynamicCRMInfo} from '../services/dynamicCRM';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HomeComponent } from './home/home.component';
import { AnalyticsEngagementComponent } from './analytics-engagement/analytics-engagement.component';
import { AnalyticsContactsComponent } from './analytics-contacts/analytics-contacts.component';
import { AnalyticsContentComponent } from './analytics-content/analytics-content.component'
import {ModalModule} from './modal';
import {GlobalErrorHandler} from './global-error-handler'
import { ServerErrorInterceptor } from './server-error.interceptor';
import { ApikeyComponent } from './apikey/apikey.component';
import { EmailTemplate } from '../services/newsCredAPI/emailTemplate';

@NgModule({
  declarations: [
    AppComponent,
    InTabLoader,
    ArticleCard,
    ArticleCardSlider,
    RecommendedContentComponent,
    ContentLibraryComponent,
    SearchComponent,
    AnalyticsComponent,
    HomeComponent,
    AnalyticsEngagementComponent,
    AnalyticsContactsComponent,
    AnalyticsContentComponent,
    ApikeyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OwlModule,
    FormsModule,
    ModalModule
  ],
  providers: [
    CustomHttpClient,
    NewsCredAPI,
    EmailTemplate,
    { provide: 'newsCredConstants', useValue: NEWSCRED_CONSTANTS },
    { provide: 'AUTH_HEADER', useValue: NEWSCRED_CONSTANTS.authHeader },
    { provide: 'dynamicCRMInfo', useValue: new DynamicCRMInfo()},
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
