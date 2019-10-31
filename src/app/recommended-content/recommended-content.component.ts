import { Component,OnInit, Input, Output, EventEmitter} from '@angular/core';
import { NewsCredAPI } from '../../services/newsCredAPI';
import { Article } from '../model/article';


declare var $: any;
@Component({
  selector: 'app-recommended-content',
  templateUrl: './recommended-content.component.html',
  styleUrls: ['./recommended-content.component.scss']
})
export class RecommendedContentComponent implements OnInit{
  @Input("selectedArticles") selectedArticles:string[];
  @Output() recommendedArticlesChanged = new EventEmitter<string[]>();
  @Input("isUsed") isUsed=[];
  carouselEl;
  articles:Article[];
  public loading: boolean
  recordId:number
  currentUserID:number
  
  ngOnInit() {
    this.loading = true;
    if(this.recordId==undefined || this.recordId==null || this.currentUserID==undefined || this.currentUserID==null)
    {
      setTimeout(() => {this.ngOnInit();}, 2000);
    }
    else
    {
      this.apiService.getRecommendedArticles(this.recordId, this.currentUserID)
          .subscribe((data)=>{
            this.articles=data.result_set;
            this.carouselEl = $('.recommended-carousel');
            this.selectedArticles=[];
            this.loading=false
          }, (err) => {
          });
      }
  }
  forward()
  {
    $('.recommended-carousel').trigger('next.owl.carousel');
  }
  backward()
  {
    $('.recommended-carousel').trigger('prev.owl.carousel');
  }
  onCheckboxChange(event, value) 
  {
    if (event.target.checked) 
    {
      this.selectedArticles.push(value);
    } 
    if (!event.target.checked) 
    {
      let index = this.selectedArticles.indexOf(value);
      if (index > -1) 
      {
        this.selectedArticles.splice(index, 1);
      }
    }
    this.recommendedArticlesChanged.emit(this.selectedArticles);

    
    
  }

  constructor(private apiService: NewsCredAPI) {

    this.apiService.getRecordIdFromNewsCred()
    .then((data)=>{
      this.recordId=data["contact_id"];
    },(err)=>{
     
    });

    this.apiService.getCurrentUserIdFromNewsCred()
    .then((data)=>{
      this.currentUserID=data["user_id"];
    },(err)=>{
    });
   }

   

   
}
