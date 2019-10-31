import { Injectable } from '@angular/core';
import { element } from 'protractor';
declare var $:any
@Injectable()
export class EmailTemplate{

    DefaultEmailBody()
    {
        let defaultEmailBody='<table style=\"font-family: verdana, serif; font-size: 12px; border-collapse:separate; border-spacing: 0 1em;\">\n' ;
        defaultEmailBody+='<tbody>';

        defaultEmailBody+='<tr>\n';
        defaultEmailBody+='<td id=\"header\">Hey ';
        defaultEmailBody+='<span id=\"name\"></span>,';
        defaultEmailBody+='</td>\n';
        defaultEmailBody+='</tr>\n';

        defaultEmailBody+='<tr>\n';
        defaultEmailBody+='<td id=\"body\">Check this article hand-picked by our staff editors specially for you.<br><br>';
        defaultEmailBody+='<div id=\"snippet\"></div>Let me know what do you think; I am just one email away!<br><br>';
        defaultEmailBody+='</td>\n';
        defaultEmailBody+='</tr>\n';

        defaultEmailBody+='<tr>\n';
        defaultEmailBody+='<td id=\"footer\">Regards - <br>';
        defaultEmailBody+='<span id=\"sender-name\"></span>';
        defaultEmailBody+='</td>\n';
        defaultEmailBody+='</tr>\n';

        defaultEmailBody+='</tbody>';
        defaultEmailBody+='</table>';
        
        return defaultEmailBody;
    }
    
    getElementByTagNameAndId(template : HTMLDivElement, tagName, id)
    {
        return Array.from(template.getElementsByTagName(tagName)).find((element) => element.id === id);
    }

    setValueToEmailTemplate(articleSnippets, contactFirstName, senderName, emailTemplate)
    {
        let template = document.createElement('div');
        template.innerHTML = emailTemplate;
        this.getElementByTagNameAndId(template, 'span', 'name').innerHTML = contactFirstName;
        this.getElementByTagNameAndId(template, 'div', 'snippet').innerHTML = articleSnippets;
        this.getElementByTagNameAndId(template, 'span', 'sender-name').innerHTML = senderName;
        return template.innerHTML;
    }   
}