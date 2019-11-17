import { Component,OnInit, Input, Output, EventEmitter, SimpleChange} from '@angular/core';
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
  @Input() data;
  public carouselEl: any
  selectCategoryName = 'NewsCred Expertise';
  articles:Article[];
  categories:ArticleCategories[];
  public loading: boolean;
  constructor(private apiService: NewsCredAPI) { }

  ngOnInit() {
    this.loading = true;
    this.apiService.getCategories()
      .subscribe((data)=>{
        this.categories = data
       // this.getContentLibraryArticles()
        this.loading = false
      });
  }
  
  getContentLibraryArticles(){
    this.loading = true;
    const defaultCategory = this.categories.filter(category => category.is_default);
    this.apiService.getContentLibraryArticles(defaultCategory[0])
    .subscribe((data)=>{
      this.articles=this._sanitizeImageUrls(data);
      this.carouselEl = $('.content-carousel');
      this.selectedContents=[];
      this.loading =false
    }, (err) => {
    });
  }
  forward()
  {
    $('.content-carousel').trigger('next.owl.carousel');
  }
  backward()
  {
    $('.content-carousel').trigger('prev.owl.carousel');
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
      this.articles=this._sanitizeImageUrls(data);
      this.loading = false;
      console.log(this.articles);   
      }, (err) => {
    });
  }
  

  _sanitizeImageUrls(articles) {

    var expectedImageUrlPattern = /^(https:\/\/images[0-9]{1}.newscred.com\/[a-zA-Z0-9]{46}==)/;

    articles.forEach(function (article) {

      var matches = expectedImageUrlPattern.exec(article.image);

      if (matches) {

        var originalUrl = matches[0];

        article.image = originalUrl + '?width=300';

      }

    });



    return articles;

  }

  mousewheelowl(e)
  {
    if (e.deltaY > 0) {
      this.forward();
    } else {
      this.backward();
    }
   e.preventDefault();
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }){
    // Extract changes to the input property by its name
    let change: SimpleChange = changes['data']; 
    if(change.currentValue == "Show")
    {
      if(this.articles == undefined)
      this.getContentLibraryArticles();
    }
  }
}
