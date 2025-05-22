import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { Constant } from 'src/app/constant/Constant';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  filterFromDate:any = "";
  filterToDate:any = "";
  complaintList:any=[]
  searchComplaintList:any=[]
  constructor(private sharedShared:SharedService,private layout:LayoutComponent){
    layout.setPageTitle("Complaint");
  }
  ngOnInit(): void {
    this.getComplaintList();
  }
  getComplaintList(){
    this.layout.spinnerShow();
    let jsonDate = {
      searchType:"complaint",
      filterFromDate:this.filterFromDate,
      filterToDate:this.filterToDate
    }
    this.sharedShared.getAllList(jsonDate)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.complaintList = result;
        this.searchComplaintList = this.complaintList;
        this.layout.spinnerHide();
        this.searchComplaint();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("complaint"));
        this.layout.spinnerHide();
      }
    })
  }
  changeComplaintStatus(compaintId:any,status:any){
    let isConfirm = confirm("Do you want to "+status+" this complaint");
    if(!isConfirm){
      return;
    }
    this.layout.spinnerShow();
    let jsonData = {
      updateType:"complaintStatus",
      compaintId:compaintId,
      status:status
    }
    this.sharedShared.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getComplaintList();
        }
        else{
          this.layout.successSnackBar(result.message);
        }
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("complaintStatus"));
        this.layout.spinnerHide();
      }
    })
  }

  searchId:any="";
  searchRaiseBy:any="";
  searchMobile:any="";
  searchIssue:any="";
  searchRemark:any="";
  searchRaiseDate:any="";
  searchStatus:any="";
  searchComplaint(){
    this.searchComplaintList = this.complaintList.filter
    (
      (x: 
        { 
          Id: any;
          RaiseBy: any;
          Mobile: any;
          Issue:any;
          Remark:any;
          CreateDate:any;
          Status:any;
        }
      ) => 
      x.Id.trim().includes(this.searchId) && 
      x.RaiseBy.trim().toLowerCase().includes(this.searchRaiseBy.toLowerCase()) && 
      x.Mobile.trim().toLowerCase().includes(this.searchMobile.toLowerCase()) && 
      x.Issue.trim().toLowerCase().includes(this.searchIssue.toLowerCase()) && 
      x.Remark.trim().toLowerCase().includes(this.searchRemark.toLowerCase()) && 
      x.CreateDate.trim().toLowerCase().includes(this.searchRaiseDate.toLowerCase()) && 
      x.Status.trim().toLowerCase().includes(this.searchStatus.toLowerCase())
    );
    this.myPagination.itemCount = this.searchComplaintList.length;
    this.myPagination.createPagination();

  }
}
