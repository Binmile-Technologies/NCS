import { Injectable, Inject, Optional } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NEWSCRED_CONSTANTS } from 'src/config';
declare var $: any;

@Injectable()
export class DynamicCRMInfo {
    public defaultData = {
        contact: {
            accountName: '',
            email: 'rahul@newscred.com',
            id: '00000123',
            industry: '',
            name: 'Rahul',
            contactTitle:'',
            dynamicsURL:'https://newscred.crm.dynamics.com/'
        },
        currentUserEmail: 'rahul@newscred.com',
        currentUserName: 'Rahul Rathore',
    }
    public currentUser: string
    public entity: string = environment.entityname
    public apiKey: string = "";
    public loop: number = 0;

    public getCurrentEntity() {
        let parentXrm = (<any>window.parent).Xrm;
        this.entity = parentXrm.Page.data.entity.getEntityName();
    }

    public getErrorMessage() {
        var displayMessage = 'Please contact support@newscred.com.';
        return displayMessage;
    }

    public getAPIKey() {
        var APIKey: string;
        let parentXrm = (<any>window.parent).Xrm;
        var errorMessage = this.getErrorMessage();
        var fetchData = {
            ncs_entity: this.entity
        };
        var fetchXml = [
            "<fetch mapping='logical' version='1.0'>",
            "  <entity name='ncs_newscredapikey'>",
            "  </entity>",
            "</fetch>",
        ].join("");
        var encodedFetchXml = encodeURI(fetchXml);
        var queryPath = "/api/data/v9.1/ncs_newscredapikeies?fetchXml=" + encodedFetchXml;
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + queryPath, false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    var keys = results.value;

                    APIKey = keys[0]["ncs_apikey"];
                    if (results == null) {
                        return results;
                    }
                } else {
                    parentXrm.Utility.alertDialog(this.status + " Unable to get API Key . </br>" + NEWSCRED_CONSTANTS.ContactNewsCred);
                    APIKey = null;
                }
            }
        };
        req.send();

        this.apiKey = APIKey;
    }



    //Nazish - Fetching current user details from dynamics 365
    public getCurrentUser() {
        let fullname = "";
        let internalemailaddress = "";
        let loggedInUserId = "";
        let context = Xrm.Utility.getGlobalContext();
        loggedInUserId = context.userSettings.userId.replace("{", "").replace("}", "");
        let parentXrm = (<any>window.parent).Xrm;

        var req = new XMLHttpRequest();
        req.open("GET", parentXrm.Page.context.getClientUrl() + "/api/data/v9.1/systemusers(" + loggedInUserId + ")?$select=fullname,internalemailaddress", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var result = JSON.parse(this.response);
                    fullname = result["fullname"];
                    internalemailaddress = result["internalemailaddress"];
                } else {
                    parentXrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();

        if (fullname != "" && internalemailaddress != "") {
            this.defaultData.currentUserEmail = internalemailaddress;
            this.defaultData.currentUserName = fullname;

            return {
                name: fullname,
                email: internalemailaddress
            }
        }
    }

    //Nazish - Getting current record details from dynamics 365
    getCurrectRecord() {

        let name = "";
        let email = "";
        let contactId = "";
        let contactName = "";
        let recordName = "";
        let parentXrm = (<any>window.parent).Xrm;
        let entityName = parentXrm.Page.data.entity.getEntityName();
        let currentRecord = parentXrm.Page.data.entity.getId().replace("{", "").replace("}", "");

        if (entityName == "contact") {
            if (parentXrm.Page.getAttribute("firstname").getValue() != undefined && parentXrm.Page.getAttribute("firstname").getValue() != null && parentXrm.Page.getAttribute("firstname").getValue() != "") {
                name += parentXrm.Page.getAttribute("firstname").getValue();
            }
            if (parentXrm.Page.getAttribute("lastname").getValue() != undefined && parentXrm.Page.getAttribute("lastname").getValue() != null && parentXrm.Page.getAttribute("lastname").getValue() != "") {
                name += " " + parentXrm.Page.getAttribute("lastname").getValue();
            }
            if (parentXrm.Page.getAttribute("emailaddress1").getValue() != undefined && parentXrm.Page.getAttribute("emailaddress1").getValue() != null && parentXrm.Page.getAttribute("emailaddress1").getValue() != "") {
                email = parentXrm.Page.getAttribute("emailaddress1").getValue();
            }
            if(parentXrm.Page.getAttribute("parentcustomerid").getValue()!=undefined && parentXrm.Page.getAttribute("parentcustomerid").getValue()!=null && parentXrm.Page.getAttribute("parentcustomerid").getValue()!="")
            {
                this.defaultData.contact.accountName=parentXrm.Page.getAttribute("parentcustomerid").getValue()[0].name;
                let accountId=parentXrm.Page.getAttribute("parentcustomerid").getValue()[0].id.replace("{", "").replace("}", "");
                this.defaultData.contact.industry = this.getIndustory(accountId);
            }
            if(parentXrm.Page.getAttribute("jobtitle").getValue()!=undefined && parentXrm.Page.getAttribute("jobtitle").getValue()!=null && parentXrm.Page.getAttribute("jobtitle").getValue()!="")
            {
                this.defaultData.contact.contactTitle=parentXrm.Page.getAttribute("jobtitle").getValue();
            }
            recordName = name;
            contactName = name;
            contactId = currentRecord;
            this.defaultData.contact.id = currentRecord;

        }
        else if (entityName == "opportunity") 
        {
            if (parentXrm.Page.getAttribute("parentcontactid").getValue() != undefined && parentXrm.Page.getAttribute("parentcontactid").getValue() != null && parentXrm.Page.getAttribute("parentcontactid").getValue() != "") {
                name = parentXrm.Page.getAttribute("parentcontactid").getValue()[0].name;
                contactId = parentXrm.Page.getAttribute("parentcontactid").getValue()[0].id.replace("{", "").replace("}", "");
            }
            if (parentXrm.Page.getAttribute("name").getValue() != undefined && parentXrm.Page.getAttribute("name").getValue() != null && parentXrm.Page.getAttribute("name").getValue() != "") {
                recordName = parentXrm.Page.getAttribute("name").getValue();
            }
            if(parentXrm.Page.getAttribute("parentaccountid").getValue()!=undefined && parentXrm.Page.getAttribute("parentaccountid").getValue()!=null && parentXrm.Page.getAttribute("parentaccountid").getValue()!="")
            {
                this.defaultData.contact.accountName=parentXrm.Page.getAttribute("parentaccountid").getValue()[0].name;
                let accountId=parentXrm.Page.getAttribute("parentaccountid").getValue()[0].id.replace("{", "").replace("}", "");
                this.defaultData.contact.industry=this.getIndustory(accountId);
            }
            contactName = name;
            let contactTitle="";
            //Contact Email and Contact Title Address for opportunity
            var req = new XMLHttpRequest();
            req.open("GET", parentXrm.Page.context.getClientUrl() + "/api/data/v9.1/contacts("+contactId+")?$select=emailaddress1,jobtitle", false);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function() {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var result = JSON.parse(this.response);
                        email= result["emailaddress1"];
                        contactTitle=result["jobtitle"];
                    } else {
                        parentXrm.Utility.alertDialog(this.statusText);
                    }
                }
            };
            req.send();

            if(contactTitle!=null && contactTitle!="")
            {
              this.defaultData.contact.contactTitle=contactTitle;
            }
        }


        else if (entityName == "account") {
            if (parentXrm.Page.getAttribute("name") != undefined && parentXrm.Page.getAttribute("name") != null && parentXrm.Page.getAttribute("name") != "") {
                name = parentXrm.Page.getAttribute("name").getValue();
            }
            if (parentXrm.Page.getAttribute("emailaddress1") != undefined && parentXrm.Page.getAttribute("emailaddress1") != null && parentXrm.Page.getAttribute("emailaddress1") != "") {
                email = parentXrm.Page.getAttribute("emailaddress1").getValue();
            }
        }
        this.defaultData.contact.email = email;
        this.defaultData.contact.name = name;
        return {
            id: currentRecord,
            contactId: contactId,
            contactName: contactName,
            entityType: entityName,
            recordName: recordName
        }
    }
     
    getIndustory(accountId)
    {
        let parentXrm = (<any>window.parent).Xrm;
        let industry="";
        var req = new XMLHttpRequest();
        req.open("GET", parentXrm.Page.context.getClientUrl() + "/api/data/v9.1/accounts("+accountId+")?$select=industrycode", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function() {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var result = JSON.parse(this.response);
                    var industrycode = result["industrycode"];
                    industry = result["industrycode@OData.Community.Display.V1.FormattedValue"];
                } else {
                    parentXrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();
        
        return industry;
    }
    //Nazish - Updating activity while copying the record
    updateActivity(regards, subject, description) {

        let parentXrm = (<any>window.parent).Xrm;
        let entityName = parentXrm.Page.data.entity.getEntityName();
        let entity = {};
        if (entityName == "contact") {
            entity = {
                subject: subject,
                description: description,
                ["regardingobjectid_contact@odata.bind"]: "/contacts(" + regards + ")",
                ncs_relatedto: "newscred"
            }
        }
        else if (entityName == "opportunity") {
            entity = {
                subject: subject,
                description: description,
                ["regardingobjectid_opportunity@odata.bind"]: "/opportunities(" + regards + ")",
                ncs_relatedto: "newscred"
            }
        }
        let req = new XMLHttpRequest();
        req.open("POST", parentXrm.Page.context.getClientUrl() + "/api/data/v9.1/tasks", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 204) {
                    var uri = this.getResponseHeader("OData-EntityId");
                    var regExp = /\(([^)]+)\)/;
                    var matches = regExp.exec(uri);
                    var newEntityId = matches[1];
                } else {
                    parentXrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send(JSON.stringify(entity));
    }

    //Nazish - opening the email form on click on send as email button
    sendEmail(emailBody, userId, recordId, selectedArticles) {
        let parentXrm = (<any>window.parent).Xrm;

        let subject = "Hey " + this.getCurrectRecord().contactName;
        let description = emailBody;

        let toContact = [];
        toContact[0] = new Object();
        toContact[0].id = this.getCurrectRecord().contactId;
        toContact[0].name = this.getCurrectRecord().contactName;
        toContact[0].entityType = "contact";

        let regarding = [];
        regarding[0] = new Object();
        regarding[0].id = this.getCurrectRecord().id;
        regarding[0].name = this.getCurrectRecord().recordName;
        regarding[0].entityType = this.getCurrectRecord().entityType;

        let parameters = [];
        parameters["to"] = toContact;
        parameters["description"] = description;
        parameters["subject"] = subject;
        parameters["regardingobjectid"] = regarding;
        parameters["ncs_relatedto"] = "newscred";
        parameters["ncs_record_id"]=recordId;
        parameters["ncs_user_id"]=userId;
        parameters["ncs_selected_articles"]=selectedArticles.toString();
        parentXrm.Utility.openEntityForm("email", null, parameters);
    }
    constructor() {
        if (environment.production) {
            this.getCurrectRecord();
            this.getCurrentUser();
            this.getCurrentEntity();
            this.getAPIKey();
            this.defaultData.contact.dynamicsURL=this.GetDynamicsURL();
        }
        else {
            this.apiKey = NEWSCRED_CONSTANTS.authHeader;


        }
    }


    UpdateKey( keyInput) {
        
        var entity: any = {};
        entity.ncs_apikey = keyInput;

        var req = new XMLHttpRequest();
        req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/ncs_newscredapikeies", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {

                req.onreadystatechange = null;
                if (this.status === 204) {
                    var uri = this.getResponseHeader("OData-EntityId");
                    var regExp = /\(([^)]+)\)/;
                    var matches = regExp.exec(uri);
                    var newEntityId = matches[1];
                }
                else {
                    alert(this.status)
                }
            }
        };
        req.send(JSON.stringify(entity));
    }
    
    GetContactDetailsForAccountAnalytics() {
        let body= "{\"contacts\":[";
        let parentXrm = (<any>window.parent).Xrm;
        let accountId = parentXrm.Page.data.entity.getId();
        var req = new XMLHttpRequest();
        var dynamicsbaseURL = parentXrm.Page.context.getClientUrl() + "/main.aspx?pagetype=entityrecord&etn=contact&id="
      
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/contacts?$select=_accountid_value,contactid,emailaddress1,fullname,jobtitle&$filter=_accountid_value eq "+ accountId, false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    for (var i = 0; i < results.value.length; i++) {
                        var _accountid_value = results.value[i]["_accountid_value"];
                        var _accountid_value_formatted = results.value[i]["_accountid_value@OData.Community.Display.V1.FormattedValue"];
                        var _accountid_value_lookuplogicalname = results.value[i]["_accountid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];

                        var contactid = results.value[i]["contactid"];
                        var emailaddress1 = results.value[i]["emailaddress1"];
                        var fullname = results.value[i]["fullname"];
                        var jobtitle = results.value[i]["jobtitle"];
                        if(i < (Number(results.value.length) - 1))
                        //body += "{\"contactPageUrl\":\""+ NEWSCRED_CONSTANTS.baseUrlAnalytics + "/" + contactid + "\",\"email\":\""+ emailaddress1 +"\",\"id\":\"" + contactid +"\",\"name\":\""+ fullname +"\",\"title\":\"" + jobtitle +"\"},";
                        body += "{\"contactPageUrl\":\""+ dynamicsbaseURL  + contactid + "\",\"email\":\""+ emailaddress1 +"\",\"id\":\"" + contactid +"\",\"name\":\""+ fullname +"\",\"title\":\"" + jobtitle +"\"},";
                        else
                        //body += "{\"contactPageUrl\":\""+ NEWSCRED_CONSTANTS.baseUrlAnalytics + "/" + contactid + "\",\"email\":\""+ emailaddress1 +"\",\"id\":\"" + contactid +"\",\"name\":\""+ fullname +"\",\"title\":\"" + jobtitle +"\"}";
                        body += "{\"contactPageUrl\":\""+ dynamicsbaseURL + contactid + "\",\"email\":\""+ emailaddress1 +"\",\"id\":\"" + contactid +"\",\"name\":\""+ fullname +"\",\"title\":\"" + jobtitle +"\"}";
                    }
                    body += "]}";
                    
                } else {
                    parentXrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();
        return body;
    }

   public GetDynamicsURL()
    {
        return Xrm.Page.context.getClientUrl()
    }
}
