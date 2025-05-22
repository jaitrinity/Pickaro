import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CommonFunction } from 'src/app/shared/CommonFunction';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
declare var $: any;

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {
  filterFromDate="";
  filterToDate="";
  filterPincode="";
  pincodeList: any = [];
  revenueList: any = [];
  subRevenueList: any = [];
  constructor(private sharedService: SharedService, private layout:LayoutComponent){

  }
  ngOnInit(): void {
    this.getAllRestPincode();
    this.getRevenueData();
  }
  getAllRestPincode(){
    let jsonData = {
      searchType: "restPincode"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.pincodeList = result;
      },
      error: _=>{
        alert("Something wrong in revenue service")
      }
    })
  }

  getRevenueData(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType: "revenue",
      filterFromDate: this.filterFromDate,
      filterToDate: this.filterToDate,
      filterPincode: this.filterPincode
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.revenueList = result;
        this.layout.spinnerHide();
      },
      error: _=>{
        alert("Something wrong in revenue service")
        this.layout.spinnerHide();
      }
    })
  }

  viewRevenueObj:any={};
  getSubRevenueList(revenueObj:any){
    this.viewRevenueObj = revenueObj;
    this.subRevenueList = revenueObj.subRevenueList;
    this.openAnyModal("subRevenueModal");
  }

  exportRevenueData(){
    if(this.revenueList.length != 0 ){
      let columnKeyArr:any = ["OrderDate","Pincode","NoOfOrder","TotalSales","CommiCollection","DeliveryCharge","Revenue"];
      let columnTitleArr:any = ["Order Date","Pincode","No Of Order","Total Sales","Commission Collection","Delivery Charge","Revenue"];
      CommonFunction.downloadFile(this.revenueList,
        'Revenue_Report.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

  openAnyModal(modalId:any){
    // $("#"+modalId).modal({
    //   backdrop : 'static',
    //   keyboard : false
    // });
    $("#"+modalId).modal("show");
  }

  closeAnyModal(modalId:any){
    $("#"+modalId).modal("hide");
  }

}
