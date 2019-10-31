import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OwlCarousel } from 'ngx-owl-carousel';

@Component({
    selector: 'article-card-slider',
    templateUrl: './slider.html',
    styleUrls: ['./slider.css'],
  })
  export class ArticleCardSlider {
    @Input('articles') articles: any
    @Input('carouselId') carouselId: string;
    @Input("isMessageVisible") isMessageVisible:boolean;
    @Input("isUsed") isUsed:any;
    carouselClasses = ['owl-theme', 'row', 'sliding']
    // @Output() contentLibraryChanged = new EventEmitter<string[]>();
    @Output() searchSelectionChanged = new EventEmitter<any>();
    @Input("selectedContents") selectedContents = [];
    constructor() { }
    ngOnInit() {
      this.carouselClasses.push(this.carouselId)
    }
    handleCardStatusChanged(event:any){
      if (event.event.target.checked) 
      {
        this.selectedContents.push(event.value);
      } 
      if (!event.event.target.checked) 
      {
        let index = this.selectedContents.indexOf(event.value);
        if (index > -1) 
        {
          this.selectedContents.splice(index, 1);
        }
      }
      this.searchSelectionChanged.emit(this.selectedContents); 
    }
}