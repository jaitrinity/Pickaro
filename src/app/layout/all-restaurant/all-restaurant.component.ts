import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Constant } from 'src/app/constant/Constant';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { CommonFunction } from 'src/app/shared/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-all-restaurant',
  templateUrl: './all-restaurant.component.html',
  styleUrls: ['./all-restaurant.component.scss']
})
export class AllRestaurantComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  imgWidth: number = 0;
  imgHeight: number = 0; 
  restImgInfo: string = "";
  restName: any = "";
  restMobile: any = "";
  restAddress: any = "";
  restPincode: any = "";
  restLatLong: any = "";
  restOpenTime: any = "";
  restCloseTime: any = "";
  restImage: any = "";
  restBanner: any = "";
  mop: any = "";

  riderList:any = [];
  selectedRiderList = [];
  editSelectedRiderList = [];
  restList:any = [];
  searchRestList:any = [];
  restPincodeList:any = [];
  // filterPincode: any = "";

  multiSelectropdownSettings = {};
  singleSelectropdownSettings = {};
  constructor(private sharedService: SharedService, 
    private layout: LayoutComponent,
    private router: Router){
      layout.setPageTitle("Restaurants")
      $(document).ready(function(){
        $('.turn').on('click', function(){
          var angle = ($('.viewImg').data('angle') + 90) || 90;
          $('.viewImg').css({'transform': 'rotate(' + angle + 'deg)'});
          $('.viewImg').data('angle', angle);
        });
      })
      this.imgWidth = Constant.IMG_WIDTH;
      this.imgHeight = Constant.IMG_HEIGHT;
      this.restImgInfo = "Image dimension should be equal to ("+this.imgWidth+"x"+this.imgHeight+")px";
  }

  ngOnInit(): void {
    this.multiSelectropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.singleSelectropdownSettings = {
      singleSelection: true,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    this.getAllRider();
    this.getRestList();
  }

  getAllRider(){
    let jsonData = {
      searchType:"allRider"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.riderList = result;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("allRider"));
      }
    })
  }

  getRestList(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType:"restaurant"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restList = result.restList;
        this.searchRestList = this.restList;
        this.restPincodeList = result.restPincodeList;
        this.layout.spinnerHide();

        this.searchRestaurant("");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurant"))
        this.layout.spinnerHide();
      }
    })
  }

  public isTrue(value:any) :boolean{
    if(value != null && value != ''){
      return true;
    }
    return false
  }

  viewImgUrl: any = ""
  viewImage(imgUrl:any){
    this.viewImgUrl = imgUrl;
    this.openAnyModal('imageModal');
  }

  getRestItem(restObj:any){
    let restId = restObj.restId; 
    this.router.navigate(['/layout/rest-menu/'+restId]);
  }

  dis(type:any,restObj:any){
    let restId = restObj.restId;
    let oldPriority = restObj.displayOrder;
    let pincode = restObj.pincode;
    if(type == 0){
      $("#label-"+restId).hide();
      $("#text-"+restId).show();
      $("#new-"+restId).val(oldPriority);
    }
    else if(type == 1){
      let newPriority = $("#new-"+restId).val();
      let searchData = this.searchRestList.filter((x: 
        { 
          pincode: any;
          displayOrder: any; 
        }) => 
          x.pincode == pincode &&
          x.displayOrder == newPriority
        );
      
      if(oldPriority == newPriority){
        this.layout.warningSnackBar("old and new priority should be different");
      }
      else if(searchData.length !=0){
        this.layout.warningSnackBar(newPriority+" priority already available to other same pincode restaurant");
      }
      else{
        this.changeRestPriority(restId,newPriority);
      }
      
    }
    else if(type == 2){
      $("#text-"+restId).hide();
      $("#label-"+restId).show();
    }
  }

  moprice(type:any,restObj:any){
    let restId = restObj.restId;
    let oldMop = restObj.mop;
    if(type == 0){
      $("#labelMop-"+restId).hide();
      $("#textMop-"+restId).show();
      $("#newMop-"+restId).val(oldMop);
    }
    else if(type == 1){
      let newMop = $("#newMop-"+restId).val();
      if(newMop == ""){
        this.layout.warningSnackBar("Please enter Minimum Order Price");
        $("#newMop-"+restId).focus();
        return;
      }
      else if(newMop == oldMop){
        this.layout.warningSnackBar("Please new Minimum Order Price should be different");
        return;
      }
      this.changeRestMop(restId,newMop);
    }
    else if(type == 2){
      $("#textMop-"+restId).hide();
      $("#labelMop-"+restId).show();
    }
  }

  restObj: any = {};
  riderAction(type:any,restObj:any){
    this.restObj = restObj;
    let restId = restObj.restId;
    let oldRiderList = restObj.riderList;
    if(type == 0){
      this.editSelectedRiderList = oldRiderList;
      this.openAnyModal("riderEditModal");
    }
    else if(type == 1){
      let newRiderId = CommonFunction.createCommaSeprate(this.editSelectedRiderList);
      if(this.editSelectedRiderList.length == 0){
        this.layout.warningSnackBar("Select atleast one rider");
        return;
      }
      this.changeRestRider(restId,newRiderId);
    }
    else if(type == 2){
      this.closeAnyModal("riderEditModal");
    }
  }

  changeRestRider(restId:any,newRiderId:any){
    this.layout.spinnerShow();
    let jsonData = {
      updateType:'updateRestRider',
      restId:restId,
      riderId: newRiderId
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.layout.successSnackBar(result.message);
          this.closeAnyModal("riderEditModal");
          this.getRestList();
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
        this.layout.spinnerHide();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("updateRestRider"))
      }
    })
  }

  changeRestMop(restId:any,newMop:any){
    let jsonData = {
      updateType:'updateRestMop',
      restId:restId,
      mop: newMop
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.layout.successSnackBar(result.message)
          this.getRestList();
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("updateRestMop"))
      }
    })
  }

  changeRestPriority(restId:any,newPriority:any){
    let jsonData = {
      updateType:'updateRestPriority',
      restId:restId,
      priority: newPriority
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.layout.successSnackBar(result.message)
          this.getRestList();
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("updateRestPeriority"))
      }
    })
  }

  // filterRestaurant(){
  //   this.searchRestList = this.restList.filter
  //   (
  //     (x: 
  //       { 
  //         pincode: any
  //       }
  //     ) => 
  //     x.pincode == this.filterPincode
  //   );
  //   this.myPagination.itemCount = this.searchRestList.length;
  //   this.myPagination.createPagination();
  // }

  searchRestId: any="";
  searchRestName: any="";
  searchRestMobile: any="";
  searchRestPriority: any="";
  searchRestApprove: any="";
  searchRestEnable: any="";
  searchRestStatus: any="";
  searchRestPincode: any="";
  searchRestaurant(evt:any){
    this.searchRestList = this.restList.filter
    (
      (x: 
        { 
          displayOrder: any;
          name: any;
          status:any;
          enableTxt:any;
          pincode:any;
        }
      ) => 
      x.displayOrder.trim().includes(this.searchRestPriority) && 
      x.name.trim().toLowerCase().includes(this.searchRestName.toLowerCase()) && 
      x.status.trim().toLowerCase().includes(this.searchRestStatus.toLowerCase()) && 
      x.enableTxt.trim().toLowerCase().includes(this.searchRestEnable.toLowerCase()) && 
      x.pincode.trim().toLowerCase().includes(this.searchRestPincode.toLowerCase())
    );
    this.myPagination.itemCount = this.searchRestList.length;
    this.myPagination.createPagination();
  }

  changeRestStatus(restId:any, action:any, actionTxt:any){
    let isConfirm = confirm("Do you want to "+actionTxt+" this restaurant?");
    if(!isConfirm){
      return;
    }
    let updateType = "enaDisRest";
    if(actionTxt == 'Open' || actionTxt == 'Close'){
      updateType = "openCloseRest";
    }
    let jsonData = {
      updateType: updateType,
      restId: restId,
      action: action,
      actionTxt: actionTxt
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getRestList();
          this.layout.successSnackBar(result.message)
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("enaDisRest"))
      }
    })
  }

  exportRestaurant(){
    if(this.searchRestList.length != 0 ){
      let columnKeyArr:any = ["displayOrder","name","mobile","enableTxt"];
      let columnTitleArr:any = ["Priority","Name","Mobile","Enable"];
      CommonFunction.downloadFile(this.searchRestList,
        'Restaurant.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

  restImageBase64: any="";
  restBannerBase64: any="";
  changeListener($event:any, imageId:any):void{
    const selectedFile = $event.target.files[0];
    if (selectedFile) {
      this.checkImageDimensions(selectedFile,imageId);
    }
  }

  checkImageDimensions(file: File, imageId:any) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if((imageId == "restImage" || imageId == "restBanner") && 
        (width != this.imgWidth || height != this.imgHeight)
        ){
          let type = "";
          if(imageId == "restImage"){
            this.restImageBase64 = "";
            $("#restImageBase64").val("");
            type = "Restaurant img ";
          }
          else if(imageId == "restBanner"){
            this.restBannerBase64 = "";
            $("#restBannerBase64").val("");
            type = "Restaurant banner ";
          }
          alert(type+'dimensions must be equal to ('+this.imgWidth+'x'+this.imgHeight+')px.');
        }
        else{
          this.uploadImage(file,imageId);
        }
      };
    };
    reader.readAsDataURL(file);
  }

  uploadImage(file: File, imageId: any){
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
      if(imageId == "restImage"){
        this.restImageBase64 = image;
      }
      else if(imageId == "restBanner"){
        this.restBannerBase64 = image
      }
      
      if(wrongFile){
        this.restImageBase64 = "";
        this.restBannerBase64 = "";
      }
    }
    myReader.readAsDataURL(file);
  }

  validateRestData() : any{
    if(this.restName.trim() == ""){
      this.layout.warningSnackBar("Enter name");
      return false;
    }
    else if(this.restMobile.trim() == ""){
      this.layout.warningSnackBar("Enter mobile");
      return false;
    }
    else if(this.restMobile.length != 10){
      this.layout.warningSnackBar("Mobile length should be 10");
      return false;
    }
    else if(this.restPincode ==""){
      this.layout.warningSnackBar("Enter Pincode");
      return false;
    }
    // else if(this.restPincode.length != 6){
    //   this.layout.warningSnackBar("Pincode length should be 6");
    //   return false;
    // }
    else if(this.restLatLong.trim() == ""){
      this.layout.warningSnackBar("Latlong should be fill");
      return false;
    }
    else if(this.restCloseTime != "" && this.restOpenTime == ""){
      this.layout.warningSnackBar("Please select open time");
      return false;
    }
    else if(!this.checkCloseTime()){
      return false;
    }
    else if(this.mop == ""){
      this.layout.warningSnackBar("Please enter Minimum Order Price");
      return false;
    }
    else if(this.selectedRiderList.length == 0){
      this.layout.warningSnackBar("Select atleast one rider");
      return false;
    }
    return true;
  }

  checkCloseTime():any{
    let openTime:any = new Date("2023-11-17 "+this.restOpenTime);
    let closeTime:any = new Date("2023-11-17 "+this.restCloseTime);
    let diff = closeTime - openTime;
    // console.log(openTime+" : "+closeTime+" : "+diff)
    if(diff < 0){
      this.layout.warningSnackBar("Close time should be greater than to open time");
      return false;
    }
    return true;
  }

  saveRestaurant(){
    if(!this.validateRestData()){
      return;
    }
    let riderId = CommonFunction.createCommaSeprate(this.selectedRiderList);

    let jsonData = {
      insertType: "restaurant",
      name: this.restName,
      mobile: this.restMobile,
      address: this.restAddress,
      pincode: this.restPincode,
      latlong: this.restLatLong,
      image64:this.restImageBase64,
      banner64:this.restBannerBase64,
      openTime:this.restOpenTime,
      closeTime:this.restCloseTime,
      mop: this.mop,
      riderId: riderId
    }
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.layout.successSnackBar(result.message);
          this.closeAnyModal("newRestModal");
          this.getRestList();
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("saveRestaurant"))
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
