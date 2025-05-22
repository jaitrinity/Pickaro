import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutComponent } from '../layout.component';
import { SharedService } from 'src/app/shared/SharedService';
import { take } from 'rxjs';
import { Constant } from 'src/app/constant/Constant';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { CommonFunction } from 'src/app/shared/CommonFunction';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  customerList:any=[];
  searchCustomerList:any=[];
  constructor(private sharedService: SharedService,private layout:LayoutComponent){

  }
  ngOnInit(): void {
    this.getCustomer();
  }

  getCustomer(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType: "customer",
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.customerList = result;
        this.searchCustomerList = this.customerList;
        this.layout.spinnerHide();
        this.searchCustomer("");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("orders"));
        this.layout.spinnerHide();
      }
    })
  }

  searchSrNo: any = "";
  searchCustName: any = "";
  searchMobile: any = "";
  searchRegisterDate: any = "";
  searchCustomer(event:any){
    this.searchCustomerList = this.customerList.filter(
      (
        x: 
        { 
          srNo: any;
          custName: any; 
          mobile: any;
          registerDate: any;
        }
      ) =>  
      x.srNo.trim().toLowerCase().includes(this.searchSrNo.toLowerCase()) && 
      x.custName.trim().toLowerCase().includes(this.searchCustName.toLowerCase()) && 
      x.mobile.trim().toLowerCase().includes(this.searchMobile.toLowerCase()) && 
      x.registerDate.trim().toLowerCase().includes(this.searchRegisterDate.toLowerCase()) 
    );
    this.myPagination.itemCount = this.searchCustomerList.length;
    this.myPagination.createPagination();
  }

  exportCustomer(){
    if(this.searchCustomerList.length != 0 ){
      let columnKeyArr:any = ["custName","mobile","registerDate"];
      let columnTitleArr:any = ["Name","Mobile","Register Date"];
      CommonFunction.downloadFile(this.searchCustomerList,
        'Customer_Report.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

}
