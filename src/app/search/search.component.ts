import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsCredAPI } from '../../services/newsCredAPI'
import { Article } from '../model/article'

declare var $: any;
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  public loading: boolean
  public query: string
  @Input("articles") articles: Article[]
  public carouselEl: any
  public carouselId: string
  public isMessageVisible:boolean
  @Input() isUsed:any
  @Input("searchSelectedContent") searchSelectedContent:any
  @Output() searchSelectionChanged = new EventEmitter<any>();
  constructor(private apiService: NewsCredAPI) { 
    this.carouselId = "search-carousel"
  }
  
  ngOnInit() {
    this.isMessageVisible=false;
  }

  handleSearch() {
    if(this.query==undefined || this.query==null || this.query=="")
    {
      return;
    }
    this.loading = true;
    this.apiService.searchArticles(this.query)
    .subscribe(data => {
      this.articles = this._sanitizeImageUrls(data.result_set);
      this.loading = false;
      if(this.articles.length<=0)
      {
       this.isMessageVisible=true;
      }
      console.log(this.carouselEl)
    });
  }

  forward(){
    $('.' + this.carouselId).trigger('next.owl.carousel');
  }
  backward()
  {
    $('.' + this.carouselId).trigger('prev.owl.carousel');
  }

  handleSelectionChange(event){
    this.searchSelectionChanged.emit(event);
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
  handleKeyDownInput(event) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  
 
}
