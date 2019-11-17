import { Component, OnInit } from '@angular/core';
import { NewsCredAPI } from '../../services/newsCredAPI';
import { zip } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-analytics-content',
  templateUrl: './analytics-content.component.html',
  styleUrls: ['./analytics-content.component.scss']
})
export class AnalyticsContentComponent implements OnInit {
  
  loggedInUser:string;
  rows: any = [];
  fetchingData: boolean;
  columns: any = ['Content'];
  contactGroups : any = [];
  constructor(private apiService: NewsCredAPI) { }

  ngOnInit() {
    zip(this.apiService.getContentAnalytics())
    .subscribe(([response]) => {
     
      
      this._formatTableData(response.result_set);
    }, (err) => {throw err });
  }

  _formatTableData(response)
  {
    if(response.length >0)
    {
     $("#divContent").css("visibility", "visible");
     $("#divNoContent").css("visibility", "hidden");
    } 
    else
    {
     $("#divNoContent").css("visibility", "visible");
     $("#divContent").css("visibility", "hidden");
    
    }
    for (var i = 0; i < response.length; i++) {
      var contact = response[i];
      var columnName = contact['contact_group_title'];
      this.columns.push(columnName);
      this.contactGroups.push(columnName);

      for (var j = 0; j < contact.contents.length; j++) {
        this.rows[contact.contents[j].content_guid] = this.rows[contact.contents[j].content_guid] || {};
        this.rows[contact.contents[j].content_guid].content = contact.contents[j];

        this.rows[contact.contents[j].content_guid].contactGroups = this.rows[contact.contents[j].content_guid].contactGroups || [];
        this.rows[contact.contents[j].content_guid].contactGroups.push(columnName);
      }
    }
    for (var key in this.rows) { this.rows.push(this.rows[key]); }
   // var wasContentSentToThisContactGroup = wasContentSentToThisContactGroup(selectedGroup, contactGroups);
  }

 
  wasContentSentToThisContactGroup(selectedGroup, contactGroups) {
    var wasSent = false;
    contactGroups.forEach(function (group) { if (group === selectedGroup) { wasSent = true; } });
    return wasSent;
  }
  
}
