import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HomeComponent } from './home/home.component';
import {ApikeyComponent} from  './apikey/apikey.component';


const routes: Routes = [
  { path: 'analytics',    component: AnalyticsComponent },
  // { path: '',     component: HomeComponent },
  { path: '',     component: HomeComponent },
  { path: 'apikey',      component: ApikeyComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
