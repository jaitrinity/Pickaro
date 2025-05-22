import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { take } from 'rxjs';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { Constant } from 'src/app/constant/Constant';
import { CommonFunction } from 'src/app/shared/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-rider-report',
  templateUrl: './rider-report.component.html',
  styleUrls: ['./rider-report.component.scss']
})
export class RiderReportComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  dataList:any =[];
  searchDataList:any = [];
  filterFromDate: any = "";
  filterToDate: any = "";
  riderList:any = [];
  filterRider:any = "";
  cashCount:any = 0;
  cashAmount:any = 0;
  onlineCount:any = 0;
  onlineAmount:any = 0;
  totalCount:any = 0;
  totalReceiveAmount:any = 0;
  checkedAmount:any = 0;
  constructor(private sharedService:SharedService,private layout:LayoutComponent){
    layout.setPageTitle("Rider Report")
  }
  ngOnInit(): void {
    this.getAllRider();
    // this.getRiderReport();
  }
  getAllRider(){
    let jsonData = {
      searchType:"allRider"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.riderList = result;
        if(this.riderList !=0){
          this.filterRider = this.riderList[0].riderId;
          this.getRiderReport();
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("allRider"));
      }
    })
  }

  getRiderReport(){
    if(this.filterRider == ""){
      alert("Please select a rider");
      return;
    }
    this.layout.spinnerShow();
    let jsonData = {
      searchType:"riderReport",
      filterFromDate:this.filterFromDate,
      filterToDate:this.filterToDate,
      filterRider:this.filterRider
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.dataList = result.riderReportList;
        this.searchDataList = this.dataList;
        this.cashCount = result.cashCount;
        this.cashAmount = result.cashAmount;
        this.onlineCount = result.onlineCount;
        this.onlineAmount = result.onlineAmount;
        this.totalCount = result.totalCount;
        this.totalReceiveAmount = result.totalReceiveAmount;
        this.layout.spinnerHide();
        this.searchOrder("");
        $("#check-all-Checkbox").prop("checked",false);
        this.checkedData = [];
        this.checkedAmount = 0;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("riderReport"));
        this.layout.spinnerHide();
      }
    })
  }

  exportData(){
    if(this.searchDataList.length != 0 ){
      let columnKeyArr:any = ["orderId","restName","riderName","paymentTypeTxt","grandTotal","paymentMode","receiveStatus"];
      let columnTitleArr:any = ["Order Id","Restaurant","Rider","Payment Type","Grand Total","Payment Mode","Status"];
      CommonFunction.downloadFile(this.searchDataList,
        'Rider_Report.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

  // checkAll(){
  //   let isCheckAll = $("#check-all-Checkbox").prop("checked");
  //   for(let i=0;i<this.searchDataList.length;i++){
  //     let obj = this.searchDataList[i];
  //     let orderId = obj.orderId;
  //     $("#order-pay-"+orderId).prop("checked",isCheckAll);
  //     this.changePayment(obj);
  //   }
  // }
  checkAll(){
    let isCheckAll = $("#check-all-Checkbox").prop("checked");
    for(let i=0;i<this.searchDataList.length;i++){
      let obj = this.searchDataList[i];
      let orderId = parseInt(obj.orderId);
      let receiveAmount = parseInt(obj.grandTotal);
      let receiveStatus = obj.receiveStatus;
      if(receiveStatus != "Received"){
        let isChecked = $("#order-pay-"+orderId).prop("checked");
        if(isChecked){
          $("#order-pay-"+orderId).prop("checked",false);
          let indexOf = this.checkedData.findIndex((x: {orderId:any}) => x.orderId == orderId);
          this.checkedData.splice(indexOf,1);
          if(this.checkedData.length == 0){
            this.checkedAmount = 0;
          }
          else{
            this.checkedAmount = this.checkedAmount - receiveAmount;
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
    let receiveAmount = parseInt(obj.grandTotal);
    let isChecked = $("#order-pay-"+orderId).prop("checked");
    if(isChecked){
      let jsonData = {
        orderId:orderId,
        receiveAmount:receiveAmount
      }
      this.checkedData.push(jsonData);
      this.checkedAmount = this.checkedAmount + receiveAmount;
    }
    else{
      let indexOf = this.checkedData.findIndex((x: {orderId:any}) => x.orderId == orderId);
      this.checkedData.splice(indexOf,1);
      if(this.checkedData.length == 0){
        this.checkedAmount = 0;
      }
      else{
        this.checkedAmount = this.checkedAmount - receiveAmount;
      }
    }

    let isEqual = this.checkedAmount === this.totalReceiveAmount;
    $("#check-all-Checkbox").prop("checked",isEqual);
  }

  searchOrderId:any="";
  searchOrderDatetime:any="";
  searchRestName:any="";
  searchCustName:any="";
  searchRiderName:any="";
  searchPaymentType:any="";
  searchGrandTotal:any="";
  // searchSubTotal:any="";
  searchPaymentMode:any="";
  searchReceiveStatus:any="";
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
          orderDatetime:any;
          restName: any;
          custName: any;
          riderName: any;
          paymentTypeTxt:any;
          grandTotal:any;
          // subTotal:any;
          paymentMode:any;
          receiveStatus:any;
        }
      ) => 
      x.orderId.trim().includes(this.searchOrderId) && 
      x.orderDatetime.trim().toLowerCase().includes(this.searchOrderDatetime.toLowerCase()) && 
      x.restName.trim().toLowerCase().includes(this.searchRestName.toLowerCase()) && 
      x.custName.trim().toLowerCase().includes(this.searchCustName.toLowerCase()) && 
      x.riderName.trim().toLowerCase().includes(this.searchRiderName.toLowerCase()) && 
      x.paymentTypeTxt.trim().toLowerCase().includes(this.searchPaymentType.toLowerCase()) && 
      x.grandTotal.trim().toLowerCase().includes(this.searchGrandTotal.toLowerCase()) && 
      // x.subTotal.trim().toLowerCase().includes(this.searchSubTotal.toLowerCase()) && 
      x.paymentMode.trim().toLowerCase().includes(this.searchPaymentMode.toLowerCase()) && 
      x.receiveStatus.trim().toLowerCase().includes(this.searchReceiveStatus.toLowerCase())
    );

    this.myPagination.itemCount = this.searchDataList.length;
    this.myPagination.createPagination();
  }

  receiveAmount(){
    if(this.checkedData.length == 0 && this.checkedAmount == 0){
      alert("Atleast check one");
      return;
    }
    let jsonData = {
      updateType:"riderReceiveAmount",
      checkedData: this.checkedData
    }
    this.layout.spinnerShow();
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getRiderReport();
        }
        else{
          this.getRiderReport();
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
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("riderReceiveAmount"));
        this.layout.spinnerHide();
      }
    })
  }
}
