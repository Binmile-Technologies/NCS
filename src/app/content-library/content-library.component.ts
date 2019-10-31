import { Component,OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NewsCredAPI} from '../../services/newsCredAPI';
import { Article } from '../model/article';
import {ArticleCategories} from '../model/ArticleCategories';

declare var $: any;
@Component({
  selector: 'app-content-library',
  templateUrl: './content-library.component.html',
  styleUrls: ['./content-library.component.scss']
})
export class ContentLibraryComponent implements OnInit {
  @Input("selectedContents") selectedContents:string[];
  @Output() contentLibraryChanged = new EventEmitter<string[]>();
  @Input("isUsed") isUsed=[];
  carouselEl;
  selectCategoryName = 'NewsCred Expertise';
  articles:Article[];
  categories:ArticleCategories[];
  public loading: boolean;
  constructor(private apiService: NewsCredAPI) { }

  ngOnInit() {
    this.loading = false;
    this.apiService.getCategories()
      .subscribe((data)=>{
        this.categories = data
        this.getContentLibraryArticles()
        this.loading = false
      });
  }
  
  getContentLibraryArticles(){
    this.loading = true;
    const defaultCategory = this.categories.filter(category => category.is_default);
    this.apiService.getContentLibraryArticles(defaultCategory[0])
    .subscribe((data)=>{
      this.articles=data;
      this.carouselEl = $('.owl-carousel');
      this.selectedContents=[];
      this.loading =false
    }, (err) => {
    });
  }
  forward()
  {
    this.carouselEl.trigger('next.owl.carousel');
  }
  backward()
  {
    this.carouselEl.trigger('prev.owl.carousel');
  }
  //Function added to copy store the selected links into an array
  onCheckboxChange(event, value) 
  {
    if (event.target.checked) 
    {
      this.selectedContents.push(value);
    } 
    if (!event.target.checked) 
    {
      let index = this.selectedContents.indexOf(value);
      if (index > -1) 
      {
        this.selectedContents.splice(index, 1);
      }
    }
    this.contentLibraryChanged.emit(this.selectedContents);
  }

  
  getArticlesBasedOnCategory(guid, name)
  {
    this.loading =true;
    this.selectCategoryName = name;
    const currentCategory = this.categories.filter(category => category.guid == guid)
    this.apiService.getContentLibraryArticles(currentCategory[0])
    .subscribe((data)=>{
      this.articles=data;
      this.loading = false;
      console.log(this.articles);   
      }, (err) => {
    });
  }
  
}
