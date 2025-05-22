import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { Constant } from 'src/app/constant/Constant';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { CommonFunction } from 'src/app/shared/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-partner-report',
  templateUrl: './partner-report.component.html',
  styleUrls: ['./partner-report.component.scss']
})
export class PartnerReportComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  dataList:any =[];
  searchDataList:any = [];
  filterFromDate: any = "";
  filterToDate: any = "";
  restaurantList: any = [];
  filterRestaurant: any = "";
  totalPayableAmount: any = 0;
  totalCount: any = 0;
  checkedAmount: any = 0;
  constructor(private sharedService: SharedService,private layout: LayoutComponent){
    layout.setPageTitle("Partner Report");
  }
  ngOnInit(): void {
    // this.getPartnerReport();
    this.getAllRestaurant();
  }

  getAllRestaurant(){
    let jsonData = {
      searchType:"allRestaurant"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restaurantList = result;
        if(this.restaurantList.length !=0){
          this.filterRestaurant = this.restaurantList[0].restId;
          this.getPartnerReport();
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("allRestaurant"));
      }
    })
  }

  getPartnerReport(){
    if(this.filterRestaurant == ""){
      alert("Please select a restaurant");
      return;
    }
    this.layout.spinnerShow();
    let jsonData = {
      searchType:"partnerReport",
      filterFromDate: this.filterFromDate,
      filterToDate: this.filterToDate,
      filterRestaurant:this.filterRestaurant
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.dataList = result.partnerReportList;
        this.totalPayableAmount = result.totalPayableAmount;
        this.totalCount = result.totalCount;
        this.searchDataList = this.dataList;
        this.layout.spinnerHide();
        $("#check-all-Checkbox").prop("checked",false);
        this.checkedAmount = 0;
        this.checkedData = [];
        this.searchOrder("");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("partnerReport"));
        this.layout.spinnerHide();
      }
    })
  }

  searchOrderId:any="";
  searchOrderDatetime:any="";
  searchRestName:any="";
  searchGrandTotal:any="";
  searchSubTotal:any="";
  searchPaymentAmount:any="";
  searchPaymentStatus:any="";
  searchOrder(evt:any){
    this.checkedAmount = 0;
    $(".order-pay").prop("checked",false);
    $("#check-all-Checkbox").prop("checked",false);
    this.checkedData = [];
    this.searchDataList = this.dataList.filter
    (
      (x: 
        { 
          orderId: any;
          orderDatetime: any;
          restName: any;
          grandTotal:any;
          subTotal:any;
          payableAmount:any;
          paymentStatus:any;
        }
      ) => 
      x.orderId.trim().includes(this.searchOrderId) && 
      x.orderDatetime.trim().toLowerCase().includes(this.searchOrderDatetime.toLowerCase()) && 
      x.restName.trim().toLowerCase().includes(this.searchRestName.toLowerCase()) && 
      x.grandTotal.trim().toLowerCase().includes(this.searchGrandTotal.toLowerCase()) && 
      x.subTotal.trim().toLowerCase().includes(this.searchSubTotal.toLowerCase()) && 
      x.payableAmount.trim().toLowerCase().includes(this.searchPaymentAmount.toLowerCase()) && 
      x.paymentStatus.trim().toLowerCase().includes(this.searchPaymentStatus.toLowerCase())
    );

    this.myPagination.itemCount = this.searchDataList.length;
    this.myPagination.createPagination();
  }

  exportData(){
    if(this.searchDataList.length != 0 ){
      let columnKeyArr:any = ["orderId","restName","grandTotal","subTotal","payableAmount","paymentStatus"];
      let columnTitleArr:any = ["Order Id","Restaurant","Grand Total","Sub Total","Net Payable","Payment Status"];
      CommonFunction.downloadFile(this.searchDataList,
        'Partner_Report.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

  checkAll(){
    let isCheckAll = $("#check-all-Checkbox").prop("checked");
    for(let i=0;i<this.searchDataList.length;i++){
      let obj = this.searchDataList[i];
      let orderId = parseInt(obj.orderId);
      let payableAmount = parseInt(obj.payableAmount);
      let paymentStatus = obj.paymentStatus;
      if(paymentStatus != "Paid"){
        let isChecked = $("#order-pay-"+orderId).prop("checked");
        if(isChecked){
          $("#order-pay-"+orderId).prop("checked",false);
          let indexOf = this.checkedData.findIndex((x: {orderId:any}) => x.orderId == orderId);
          this.checkedData.splice(indexOf,1);
          if(this.checkedData.length == 0){
            this.checkedAmount = 0;
          }
          else{
            this.checkedAmount = this.checkedAmount - payableAmount;
          }
        }

        $("#order-pay-"+orderId).prop("checked",isCheckAll);
        this.changePayment(obj);
      }
    }
  }

  checkedData:any=[];
  changePayment(obj:any){
    let orderId = parseInt(obj.orderId);
    let payableAmount = parseInt(obj.payableAmount);
    let isChecked = $("#order-pay-"+orderId).prop("checked");
    if(isChecked){
      let jsonData = {
        orderId:orderId,
        payableAmount:payableAmount
      }
      this.checkedData.push(jsonData);
      this.checkedAmount = this.checkedAmount + payableAmount;
    }
    else{
      let indexOf = this.checkedData.findIndex((x: {orderId:any}) => x.orderId == orderId);
      this.checkedData.splice(indexOf,1);
      if(this.checkedData.length == 0){
        this.checkedAmount = 0;
      }
      else{
        this.checkedAmount = this.checkedAmount - payableAmount;
      }
    }
    let isEqual = this.checkedAmount === this.totalPayableAmount;
    $("#check-all-Checkbox").prop("checked",isEqual);
  }

  payAmount(){
    if(this.checkedData.length == 0){
      alert("Atleast check one");
      return;
    }
    let jsonData = {
      updateType:"orderPayment",
      checkedData: this.checkedData
    }
    this.layout.spinnerShow();
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getPartnerReport();
        }
        else{
          this.getPartnerReport();
          let failArr = result.failArr;
          for(let i=0;i<failArr.length;i++){
            let obj = failArr[i];
            let orderId = obj.orderId;
            $("#order-pay-"+orderId).prop("checked",true);
            this.changePayment(obj);
          }
        }
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("orderPayment"));
        this.layout.spinnerHide();
      }
    })
  }
}
