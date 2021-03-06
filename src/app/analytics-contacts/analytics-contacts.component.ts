import { Component, OnInit, Inject, Optional } from '@angular/core';
import { NewsCredAPI } from '../../services/newsCredAPI';
import { ModalService } from '../modal';

import { zip } from "rxjs";
import { DynamicCRMInfo } from 'src/services/dynamicCRM';
declare var $: any;

@Component({
  selector: 'app-analytics-contacts',
  templateUrl: './analytics-contacts.component.html',
  styleUrls: ['./analytics-contacts.component.scss']
})
export class AnalyticsContactsComponent implements OnInit {
  rows: any = [];
  fetchingData: boolean;
  columns: any = [];

  rowsdetail: any = [];
  columnsdetails: any = [];

  constructor(private apiService: NewsCredAPI, private modalService: ModalService,@Inject('dynamicCRMInfo') @Optional() private dynamicCRMInfo?: DynamicCRMInfo) { }

  ngOnInit() {
    zip(this.apiService.getContactsAnalytics())
      .subscribe(([response]) => {

        this._formatTableData(response.result_set);
      }, (err) => {
        alert(err)
      });

  }

  _formatTableData(response) {
    if(response.length >0)
    {
     $("#divContact").css("visibility", "visible");
     $("#divNoContact").css("visibility", "hidden");
    } 
    else
    {
     $("#divNoContact").css("visibility", "visible");
     $("#divContact").css("visibility", "hidden");
    
    }
    this.rows = [];
        this.columns = [];
        var maxRows = 0;
        for (var i = 0; i < response.length; i++) {
          var contact = response[i];
          if (contact.contacts && contact.contacts.length > maxRows) {
            maxRows = contact.contacts.length;
          }
          var columnName = contact['contact_group_title'];
          this.columns.push(columnName);
        }
        let count = 0;
        for (var i = 0; i < maxRows; i++) {
          var row  = [];
          for (var j = 0; j < response.length; j++) {
            var contact = response[j];
            if (contact.contacts && i < contact.contacts.length) {
              var dynamicsurl = this.dynamicCRMInfo.GetDynamicsURL();
               contact.contacts[i].contact_page_url = dynamicsurl+ "/main.aspx?pagetype=entityrecord&etn=contact&id="+ contact.contacts[i].id;
              row.push(contact.contacts[i]);
              if (contact.contacts[i].sent_contents.length === 0) {
                contact.contacts[i].hasNoContent = true;
              }
            } else {
              row.push({id: count++});
            }
          }
          this.rows.push(row);
        }
  }



  fetchContactDetails(id: string) {
  

    this.apiService.getContactDetails(id)
      .subscribe((data) => {
        var responsedetail = data["result_set"];
        this._formatDetailsTableData(responsedetail)
      }, (err) => {
        alert("error");
      });
  }





  _formatDetailsTableData(responseDetail) {
    this.rowsdetail = []
    this.columnsdetails = []

    this.rowsdetail = responseDetail;
    // this.rowsdetail = [
    //   {
    //     "content_guid": "2787cc8840660d95cf278ef1c0dcdd0f",
    //     "content_title": "The Importance of SEO for Content Distribution — and How our Content Marketing Platform Can Help",
    //     "read_at": null,
    //     "sent_at": "2019-10-01 08:30:33"
    //   }
    // ]
    this.columnsdetails = [
      'Content',
      'Sent Time',
      'Read Time'
    ];
    this.modalService.open('contactdetails');
    $("#divModal").css('width','80%')
    $("#divModal").css('margin-top','-21rem')
    $("#divModal").css('overflow-x','hidden')
  
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }


  ngAfterViewInit() {
   
    
   
  }
 
}
