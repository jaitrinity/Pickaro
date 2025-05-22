import { Component, OnInit,ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { CommonFunction } from 'src/app/shared/CommonFunction';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { Constant } from 'src/app/constant/Constant';
declare var $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  loginEmpRoleId: any = "";
  loginUserId: any = "";
  filterStartDate: any = "";
  filterEndDate: any = ""
  orderList: any = [];
  columnName: any = [];
  columnData: any = [];
  searchOrderList: any = [];
  orderItemList: any = [];
  constructor(private sharedService: SharedService,private layout:LayoutComponent){
    layout.setPageTitle("Order");
    this.loginUserId = localStorage.getItem("loginUserId");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
  }
  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType: "orders",
      filterStartDate: this.filterStartDate,
      filterEndDate: this.filterEndDate
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.orderList = result.orderList;
        this.columnName = result.columnName;
        this.columnData = result.columnData;
        this.searchOrderList = this.orderList;
        this.layout.spinnerHide();
        this.searchOrder("");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("orders"));
        this.layout.spinnerHide();
      }
    })
  }

  viewOrderId: any;
  viewOrderObj:any = {};
  getOrderItem(orderObj:any){
    this.deleteItemArr = [];
    this.newTotalPrice = 0;
    this.newGrandTotal = 0;
    this.editCount = 0;
    this.viewOrderObj = orderObj;
    this.viewOrderId = orderObj.orderId;
    let jsonData = {
      searchType: "orderItem",
      orderId: this.viewOrderId
    }
    this.layout.spinnerShow();
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.orderItemList = result;
        this.layout.spinnerHide();
        this.openAnyModal("viewOrderModal");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("orderItem"));
        this.layout.spinnerHide();
      }
    })
  }

  searchOrderId: any = "";
  searchRestaurant: any = "";
  searchCustomer: any = "";
  searchPrimaryMobile: any = "";
  // searchRiderName: any = "";
  // searchRiderMobile: any = "";
  searchRider: any = "";
  searchPaymentMode: any = "";
  searchGrandTotal: any = "";
  searchPickup: any = "";
  searchInstruction: any = "";
  searchTotalPrice: any = "";
  searchStatus: any = "";
  searchDatatime: any = "";
  searchOrder(event:any){
    this.searchOrderList = this.orderList.filter(
      (
        x: 
        { 
          orderId: any; 
          restName: any;
          custName: any;
          primaryMobile: any;
          // riderName: any;
          // riderMobile: any;
          riderInfo: any;
          paymentMode: any;
          grandTotal: any,
          selfPickUp: any,
          statusTxt: any;
          orderDatetime: any;
        }
      ) => 
      x.orderId.trim().includes(this.searchOrderId) && 
      x.restName.trim().toLowerCase().includes(this.searchRestaurant.toLowerCase()) && 
      x.custName.trim().toLowerCase().includes(this.searchCustomer.toLowerCase()) && 
      x.primaryMobile.trim().toLowerCase().includes(this.searchPrimaryMobile.toLowerCase()) && 
      // x.riderName.trim().toLowerCase().includes(this.searchRiderName.toLowerCase()) && 
      // x.riderMobile.trim().toLowerCase().includes(this.searchRiderMobile.toLowerCase()) && 
      x.riderInfo.trim().toLowerCase().includes(this.searchRider.toLowerCase()) && 
      x.paymentMode.trim().toLowerCase().includes(this.searchPaymentMode.toLowerCase()) && 
      x.grandTotal.trim().toLowerCase().includes(this.searchGrandTotal.toLowerCase()) && 
      x.selfPickUp.trim().toLowerCase().includes(this.searchPickup.toLowerCase()) && 
      x.statusTxt.trim().toLowerCase().includes(this.searchStatus.toLowerCase()) && 
      x.orderDatetime.trim().includes(this.searchDatatime)
    );
    this.myPagination.itemCount = this.searchOrderList.length;
    this.myPagination.createPagination();
  }

  exportOrder(){
    if(this.searchOrderList.length != 0 ){
      let columnKeyArr:any = ["orderId","restName","custName","primaryMobile","riderInfo","paymentMode","instruction","grandTotal","statusTxt","orderDatetime"];
      let columnTitleArr:any = ["Order Id","Restaurant","Customer","Primary Mobile","Rider","Payment Mode","Instruction","Grand Total","Status","Order Date"];
      CommonFunction.downloadFile(this.searchOrderList,
        'Order_Report.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

  deleteOrder(orderId:any){
    let isConfirm = confirm("Do u want delete this order?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType:"deleteOrder",
      loginUserId:this.loginUserId,
      orderId: orderId
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getOrders();
        }
        this.layout.successSnackBar(result.message)
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("deleteOrder"));
        this.layout.spinnerHide();
      }
    })
  }

  createRange(number: any){
    var items: number[] = [];
    number *= 10;
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  editCount = 0;
  editAny(notEdit:any,edit:any,orderItemObj:any){
    let orderItemId = orderItemObj.orderItemId;
    $("."+notEdit+"-"+orderItemId).hide();
    $("."+edit+"-"+orderItemId).show();
    this.editCount++;
  }
  cancelAny(edit:any,notEdit:any,orderItemObj:any){
    let orderItemId = orderItemObj.orderItemId;
    $("."+edit+"-"+orderItemId).hide();
    $("."+notEdit+"-"+orderItemId).show();
    this.editCount--;
  }

  newTotalPrice : any = 0;
  newGrandTotal : any = 0;
  changeItemQty(evt: any, orderItemObj:any){
    let newQty = evt.target.value;
    // let orderItemId = orderItemObj.orderItemId;
    let perUnitPrice = orderItemObj.perUnitPrice;

    orderItemObj.newQuantity = newQty;
    let newItemPrice = parseInt(perUnitPrice) * parseInt(newQty);
    orderItemObj.price = newItemPrice;
    // $("#newItemPrice"+"-"+orderItemId).val(newItemPrice);

    this.newTotalPrice = 0;
    this.newGrandTotal = 0;
    for(let i=0;i<this.orderItemList.length;i++){
      let orderItemObj = this.orderItemList[i];
      // let orderItemId = orderItemObj.orderItemId;
      // let newItemPrice = $("#newItemPrice"+"-"+orderItemId).val();
      let newItemPrice = orderItemObj.price;
      this.newTotalPrice += parseInt(newItemPrice) ;
    }

    let deliveryCharge = this.viewOrderObj.deliveryCharge;
    this.newGrandTotal = this.newTotalPrice + parseInt(deliveryCharge)
  }

  editOrderItem(){
    let jsonData = {
      updateType: 'updateOrderItem',
      orderId: this.viewOrderId,
      totalPrice: this.newTotalPrice,
      grandTotal: this.newGrandTotal,
      orderItemList: this.orderItemList
    }
    // console.log(JSON.stringify(jsonData));
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.closeAnyModal("viewOrderModal");
          this.getOrders();
        }
        this.layout.successSnackBar(result.message)
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("editOrderItem"));
        this.layout.spinnerHide();
      }
    })
  }

  deleteItemArr: any = [];
  deleteItemPrice: any = 0;
  checkDeleteOrderItem(evt: any, orderItemObj:any){
    let isChecked = evt.target.checked;
    let orderItemId = orderItemObj.orderItemId;
    let price = orderItemObj.price;
    let index = this.deleteItemArr.indexOf(orderItemId);
    if(isChecked){
      this.deleteItemArr.push(orderItemId);
      this.deleteItemPrice =  this.deleteItemPrice + parseInt(price);
    }
    else{
      this.deleteItemArr.splice(index, 1);
      this.deleteItemPrice =  this.deleteItemPrice - parseInt(price);
    }
    // console.log(this.deleteItemArr) 
  }
  
  deleteOrderItem(){
    let isConfirm = confirm("Do u want delete checked order item?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType: 'deleteOrderItem',
      loginUserId: this.loginUserId,
      orderId: this.viewOrderId,
      deleteItemPrice: this.deleteItemPrice,
      deleteItemArr: this.deleteItemArr
    }
    // console.log(JSON.stringify(jsonData))
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.closeAnyModal("viewOrderModal");
          this.getOrders();
        }
        this.layout.successSnackBar(result.message)
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("deleteOrderItem"));
        this.layout.spinnerHide();
      }
    })
  }

  changeOrderStatus(orderId:any){
    let isConfirm = confirm("Do u want to Order received?");
    if(!isConfirm){
      return;
    }
    this.layout.spinnerShow();
    let jsonData = {
      orderId: orderId,
      status: 5 // Delivered
    }
    this.sharedService.changeOrderStatus(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getOrders();
        }
        this.layout.successSnackBar(result.message)
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("changeOrderStatus"));
        this.layout.spinnerHide();
      }
    })
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
