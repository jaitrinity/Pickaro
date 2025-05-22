import { Component, Input, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  // no of row count
  @Input() itemCount:number = 0;
  // no of record shown in one page
  @Input() perPageRecord: number = 0;
  // no of pagination show in page
  @Input() showPage: number = 0;
  paginationArr: any = [];

  constructor(){}
  ngOnInit(): void {
    this.createPagination()
  }

  noOfPage:number = 0;
  createPagination(){
    let division: any = this.itemCount / this.perPageRecord;
    let reminder: any = this.itemCount % this.perPageRecord;
    if(reminder != 0){
      this.noOfPage = parseInt(division) + 1;
    }
    else{
      this.noOfPage = parseInt(division);
    }
    let pagination = "";
    for(let i=1;i<=this.noOfPage;i++){
      let mode = i%this.showPage;
      pagination += i;
      if(i != this.noOfPage){
        if(mode == 0){
          pagination += ":"
        }
        else{
          pagination += ",";
        }
      }  
    }
    this.paginationArr = pagination.split(":");
    setTimeout(() => {
      this.loadPage(1)
    }, 100);
    
  }

  loadPage(pageNo:any){
    $(".my-pagination").removeClass("pagination-active");
    $(".my-pagination_"+pageNo).addClass("pagination-active");
    $(".table-row").hide();
    let paginationIndex = pageNo - 1;
    let minIndex = paginationIndex*this.perPageRecord + 1;
    let maxIndex = paginationIndex*this.perPageRecord + this.perPageRecord;
    for(let i=minIndex;i<=maxIndex;i++){
      $(".data-"+i).show();
    }
  }

  activeIndex = 0;
  gotoPrev(i:any){
    $("#div"+i).hide()
    $("#div"+(i-1)).show();
    i = i-1;
    this.activeIndex = i;
    $("#page-select").prop('selectedIndex', this.activeIndex);
    this.loadPage(this.showPage*i+1);
  }
  gotoNext(i:any){
    $("#div"+i).hide()
    $("#div"+(i+1)).show();
    i = i+1;
    this.activeIndex = i;
    $("#page-select").prop('selectedIndex', this.activeIndex);
    this.loadPage(this.showPage*i+1);
  }

  gotoBeginEnd(hideIndex:any,showIndex:any){
    $("#div"+hideIndex).hide();
    $("#div"+showIndex).show();
    this.activeIndex = showIndex;
    $("#page-select").prop('selectedIndex', this.activeIndex);
    this.loadPage(this.showPage*showIndex+1);
  }

  changePagination(evt:any){
    let v = evt.target.value;
    $("#div"+this.activeIndex).hide();
    $("#div"+v).show();
    this.activeIndex = v;
    this.loadPage(this.showPage*v+1);
  }
}
