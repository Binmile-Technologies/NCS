import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsCredAPI } from '../../services/newsCredAPI';
import { AnalyticsModel } from '../model/Analytics';
import { zip } from "rxjs";

@Component({
  selector: 'app-analytics-engagement',
  templateUrl: './analytics-engagement.component.html',
  styleUrls: ['./analytics-engagement.component.scss']
})
export class AnalyticsEngagementComponent implements OnInit {
  public Contacts: AnalyticsModel = new AnalyticsModel();

  public Ctr: AnalyticsModel = new AnalyticsModel();
  public UniqueContent: AnalyticsModel = new AnalyticsModel();
  rows: any = [];
  fetchingData: boolean;
  columns: any = [];
  constructor(private apiService: NewsCredAPI) {

   this.Contacts = new AnalyticsModel();
   this.Ctr = new AnalyticsModel();
   this.UniqueContent = new AnalyticsModel();
   this.fetchingData=false;
  
  }


  ngOnInit() {


    zip(this.apiService.getEngagementContacts(), this.apiService.getEngagementCtr(), this.apiService.getEngagementUniqueContent())
      .subscribe(([response1, response2, response3]) => {
        this.Contacts.name = "Contacts";
        this.Contacts.model = response1["result_set"];
        this.Contacts.total = response1["total_contacts"];
        this.Ctr.name = "Ctr";
        this.Ctr.model = response2["result_set"];
        this.Ctr.total = response2["total_ctr"];
        this.UniqueContent.name = "Unique";
        this.UniqueContent.model = response3["result_set"];
        this.UniqueContent.total = response3["total_unique_content"];
        this.rows = [
          {
            name: 'Contacts',
            model: this.Contacts.model,
            total: this.Contacts.total
          },
          {
            name: 'Click Through Rate',
            model: this.Ctr.model,
            total: this.Ctr.total
          },
          {
            name: 'Unique Content',
            model: this.UniqueContent.model,
            total: this.UniqueContent.total
          }
        ];
        
        this._formatTableData();
      })

  }

  _formatTableData() {
    
    const totalCol = 'Total';
    this.fetchingData = false;
    let totalContactsInGroup = 0;
    this.columns = [totalCol];
    
   
    this.rows.forEach(row => {

      row.values = row.values || {};
      row.additional_values = row.additional_values || {};
      row.model.forEach(rowDetail=> {
        const columnName = rowDetail['contact_group_title'];
        if (!this.columns.includes(columnName)) {
          this.columns.push(columnName);
        }
        row.bar_lengths = row.bar_lengths || {};
        if (row.name === 'Contacts') {
          const total = rowDetail['total_contacts_in_group'];
          const reached = rowDetail['contacts_reached'];
          totalContactsInGroup += reached;
          row.values[columnName] = reached;
          row.additional_values[columnName] = 'of ' + total;
          row.bar_lengths[columnName] =this._getContentsRatio(reached, total);
        } 
        else if (row.name === 'Click Through Rate') {
          row.values[columnName] = rowDetail['ctr'] + '%';
        } else if (row.name === 'Unique Content') {
          row.values[columnName] = rowDetail['unique_content_sent'];
          row.additional_values[columnName] = 'of ' +  row.total;
          row.bar_lengths[columnName] = this._getContentsRatio(row.values[columnName], row.total);
        }
      });
    });

    //Making total
    this.rows.forEach(row=> {
      if (row.name === 'Contacts') {
        row.values[totalCol] = totalContactsInGroup;
        
        row.additional_values[totalCol] = 'of ' + row.total;
      } else if (row.name === 'Click Through Rate') {
        row.values[totalCol] = row.total + ' %';
      } else if (row.name === 'Unique Content') {
        row.values[totalCol] = row.total;
      }
    });



   

  }
  _getContentsRatio(sent, total) {
    return Math.floor(total > 0 ? (sent / total) * 100 : 0);
  }

  getProgressBarStyle = function(threshold) {
    return threshold <= 10 ? 'red' : (threshold <= 50 ? 'yellow' : 'green');
  };
}
