import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'article-card',
    templateUrl: './card.html',
    styleUrls: ['./card.css'],
  })
  export class ArticleCard {
    @Input('articleObj') article: any
    @Output() cardStatusChanged = new EventEmitter<any>();
    @Input("isUsed") isUsed:any
    
    constructor() { }
    ngOnInit() {
    }

    onCheckboxChange(event:any, value: any) {
        this.cardStatusChanged.emit({event:event, value:value});
    }
}