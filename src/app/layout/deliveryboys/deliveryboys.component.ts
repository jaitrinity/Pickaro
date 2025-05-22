import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { Constant } from 'src/app/constant/Constant';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
declare var $: any;

@Component({
  selector: 'app-deliveryboys',
  templateUrl: './deliveryboys.component.html',
  styleUrls: ['./deliveryboys.component.scss']
})
export class DeliveryboysComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  name: string = "";
  mobile: string = "";
  aadharNo: string = "";
  aadharBase64: any = "";
  panNo: string = "";
  panBase64: any = "";
  latLong: any = "";
  riderId: any = "";

  editName: string = "";
  editMobile: string = "";
  editAadharNo: string = "";
  editAadharBase64: any = "";
  editPanBase64: any = "";
  editPanNo: any = "";
  editRiderLatLong: any = "";
  riderList: any = [];
  searchRiderList : any = [];
  constructor(private sharedService: SharedService, private layout: LayoutComponent){
    layout.setPageTitle("Rider");
    $(document).ready(function(){
      $('.turn').on('click', function(){
        var angle = ($('.viewImg').data('angle') + 90) || 90;
        $('.viewImg').css({'transform': 'rotate(' + angle + 'deg)'});
        $('.viewImg').data('angle', angle);
      });
    })
  }
  ngOnInit(): void {
    this.getRiderList();
  }

  getRiderList(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType: "rider"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.riderList = result;
        this.searchRiderList = this.riderList;
        this.layout.spinnerHide();
        this.searchRider("");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("rider"));
        this.layout.spinnerHide();
      }
    })
  }

  actDeactRider(riderId:any, action:any, actionTxt:any){
    let isConfirm = confirm("Do u want to "+actionTxt+" this rider?");
    if(!isConfirm){
      return;
    }
    this.layout.spinnerShow();
    let jsonData = {
      updateType: "actDeactRider",
      riderId: riderId,
      action: action
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.layout.successSnackBar(result.message)
          this.getRiderList();
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("actDeactRider"));
        this.layout.spinnerHide();
      }
    })
  }

  changeListener($event:any, imageId:any): void {
    this.readThis($event.target, imageId);
  }

  readThis(inputValue: any, imageId:any): void {
    var file: File = inputValue.files[0];
    let wrongFile = false;
    let fileName = file.name;
    if(!(fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1 || 
    fileName.indexOf(".png") > -1)){
      this.layout.warningSnackBar("only .jpg, .jpeg, .png format accepted, please choose right file.");
      wrongFile = true;
    }
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      if(imageId == 0){
        this.aadharBase64 = image;
      }
      else if(imageId == 1){
        this.panBase64 = image
      }
      else if(imageId == 2){
        this.editAadharBase64 = image;
      }
      else if(imageId == 3){
        this.editPanBase64 = image
      }
      
      if(wrongFile){
        if(imageId == 0){
          this.aadharBase64 = "";
          $("#file_aadharBase64").val("");
        }
        else if(imageId == 1){
          this.panBase64 = "";
          $("#file_panBase64").val("");
        }
        else if(imageId == 2){
          this.editPanBase64 = "";
          $("#file_editPanBase64").val("");
        }
        else if(imageId == 3){
          this.editPanBase64 = "";
          $("#file_editPanBase64").val("");
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  addRider(){
    if(this.name.trim() == ""){
      this.layout.warningSnackBar("enter name");
      return
    }
    else if(this.mobile.trim() == ""){
      this.layout.warningSnackBar("enter mobile");
      return;
    }
    else if(this.mobile.trim().length != 10){
      this.layout.warningSnackBar("mobile length should be equal to 10")
      return;
    }
    else if(this.aadharNo.trim() == ""){
      this.layout.warningSnackBar("enter Aadhar No");
      return;
    }
    else if(this.aadharNo.trim().length != 12){
      this.layout.warningSnackBar("Aadhar length should be equal to 12");
      return;
    }
    else if(this.aadharBase64 == ""){
      this.layout.warningSnackBar("Select aadhar file");
      return;
    }
    else if(this.panNo.trim() == ""){
      this.layout.warningSnackBar("enter PAN No");
      return;
    }
    else if(this.panNo.trim().length != 10){
      this.layout.warningSnackBar("PAN length should be equal to 10")
      return;
    }
    else if(this.panBase64 == ""){
      this.layout.warningSnackBar("select pan file");
      return
    }
    else if(this.latLong == ""){
      this.layout.warningSnackBar("enter current rider location Lat-Long");
      return
    }
    this.layout.spinnerShow();
    let jsonData = {
      insertType: "addRider",
      name: this.name,
      mobile: this.mobile,
      aadharNo: this.aadharNo,
      aadharBase64: this.aadharBase64,
      panNo: this.panNo,
      panBase64: this.panBase64,
      latLong: this.latLong
    }
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getRiderList();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message);
        }
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("addRider"));
        this.layout.spinnerHide();
      }
    })
  }

  editRider(riderObj:any){
    this.riderId = riderObj.riderId;
    this.editName = riderObj.name;
    this.editMobile = riderObj.mobile;
    this.editAadharNo = riderObj.aadharNo;
    this.editPanNo = riderObj.panNo;
    this.editRiderLatLong = riderObj.riderLatLong;
    this.openAnyModal("editRiderModal");
  }

  viewImgUrl:any = "";
  viewImage(imgUrl:any){
    this.viewImgUrl = imgUrl;
    this.openAnyModal('imageModal');
  }

  saveRider(){
    if(this.editName.trim() == ""){
      this.layout.warningSnackBar("enter name");
      return
    }
    else if(this.editMobile.trim() == ""){
      this.layout.warningSnackBar("enter mobile");
      return;
    }
    else if(this.editMobile.trim().length != 10){
      this.layout.warningSnackBar("mobile length should be equal to 10")
      return;
    }
    else if(this.editAadharNo.trim() != "" && this.editAadharNo.trim().length != 12){
      this.layout.warningSnackBar("aadhar No length should be equal to 12")
      return;
    }
    // else if(this.editAadharNo != "" && this.editAadharBase64 == ""){
    //   this.layout.warningSnackBar("Select aadhar file");
    //   return;
    // }
    else if(this.editPanNo.trim() != "" && this.editPanNo.trim().length != 10){
      this.layout.warningSnackBar("PAN no lenght should be equal to 10")
      return;
    }
    // else if(this.editPanNo != "" && this.editPanBase64 == ""){
    //   this.layout.warningSnackBar("select pan file");
    //   return
    // }
    else if(this.editRiderLatLong == ""){
      this.layout.warningSnackBar("enter enter current rider location Lat-Long");
      return
    }
    let jsonData = {
      updateType: "editRider",
      riderId: this.riderId,
      name: this.editName,
      mobile: this.editMobile,
      aadharNo: this.editAadharNo,
      aadharBase64: this.editAadharBase64,
      panNo: this.editPanNo,
      panBase64: this.editPanBase64,
      riderLatLong: this.editRiderLatLong
    }
    this.layout.spinnerShow();
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getRiderList();
          this.closeAnyModal("editRiderModal");
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message);
        }
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("editRider"));
        this.layout.spinnerHide();
      }
    })
  }

  searchRiderName: any = "";
  searchMobile: any = "";
  searchAadharNo: any = "";
  searchPanNo: any = "";
  searchRider(evt:any){
    this.searchRiderList = this.riderList.filter
    (
      (
        x: 
        {
          name: any; 
          mobile: any;
          aadharNo:any;
          panNo:any
        }
      ) => 
      x.name.trim().toLowerCase().includes(this.searchRiderName.toLowerCase()) && 
      x.mobile.trim().toLowerCase().includes(this.searchMobile.toLowerCase()) && 
      x.aadharNo.trim().toLowerCase().includes(this.searchAadharNo.toLowerCase()) && 
      x.panNo.trim().toLowerCase().includes(this.searchPanNo.toLowerCase())
    );
    
    this.myPagination.itemCount = this.searchRiderList.length;
    this.myPagination.createPagination();
    
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
