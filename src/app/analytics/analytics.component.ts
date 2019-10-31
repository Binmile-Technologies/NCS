import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  public static EngagementTabType = 1;
  public static ContactsTabType = 2;
  public static ContentTabType = 3;
  loggedInUser:string;
  constructor(private location: PlatformLocation, private router: Router) {
      this.location.onPopState(() => {
        this.router.dispose();
  });
   }

  ngOnInit() {
  
 }
  handleSelectionChange($event: any, contentType)
  {
    switch(contentType) {
      case(AnalyticsComponent.EngagementTabType):
        this.loggedInUser = ""
        break;
      case(AnalyticsComponent.ContactsTabType):
        this.loggedInUser = ""
        break;
      case(AnalyticsComponent.ContentTabType):
       this.loggedInUser = ""
        break;
    }
  }
}
