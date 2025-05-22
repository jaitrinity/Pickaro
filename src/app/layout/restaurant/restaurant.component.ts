import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Constant } from 'src/app/constant/Constant';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
declare var $: any;

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  imgWidth: number = 0;
  imgHeight: number = 0;
  imgInfo: string = "";
  categoryList: any = [];
  unitList: any = [];
  restList : any = [];
  tempRestItemList : any = [];
  restItemList : any = [];
  category: any = "";
  newCatName: any ="";
  constructor(private sharedService: SharedService, private layout: LayoutComponent){
    this.imgWidth = Constant.IMG_WIDTH;
    this.imgHeight = Constant.IMG_HEIGHT;
    this.imgInfo = "Image dimension should not be greater to ("+this.imgWidth+"x"+this.imgHeight+")";
    layout.setPageTitle("Restaurant");
    $(document).ready(function(){
      $('.turn').on('click', function(){
        var angle = ($('.viewImg').data('angle') + 90) || 90;
        $('.viewImg').css({'transform': 'rotate(' + angle + 'deg)'});
        $('.viewImg').data('angle', angle);
      });
    })
  }

  ngOnInit(): void {
    this.getAllCategory();
    this.getRestList();  
  }
  getAllCategory(){
    let jsonData = {
      searchType:"allCategory"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.categoryList = result.categoryList;
        this.unitList = result.unitList;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("allCategory"))
      }
    })
  }

  getRestList(){
    let jsonData = {
      searchType:"restaurant"
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restList = result;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurant"))
      }
    })
  }

  viewRestId: any;
  viewRestName: any;
  getRestItem(restObj:any){
    this.category = [];
    this.viewRestId = restObj.restId;
    this.viewRestName = restObj.name;
    let jsonData = {
      searchType: "restaurantItem",
      restId: this.viewRestId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.openAnyModal("viewRestModal");
        this.restItemList = result;
        this.tempRestItemList = this.restItemList;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurantItem"))
      }
    })
  }

  
  public isTrue(value:any) :boolean{
    if(value != null && value != ''){
      return true;
    }
    return false
  }

  appRejRestaurant(restId:any, action:any, actionTxt:any){
    let isConfirm = confirm("Do u want to "+actionTxt+" this restaurant?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType: 'appRejRest',
      restId: restId,
      action: action
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
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("appRejRest"))
      }
    })
  }

  enaDisRestaurant(restId:any, action:any, actionTxt:any){
    let isConfirm = confirm("Do you want to "+actionTxt+" this restaurant?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType: 'enaDisRest',
      restId: restId,
      action: action
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

  addCatId: any;
  addCatName: any;
  addItem(restCatObj:any){
    this.addCatId = restCatObj.catId;
    this.addCatName = restCatObj.name;
    this.closeAnyModal("viewRestModal");
    this.openAnyModal("addItemModal");
  }

  addCatItem(){
    this.addMore = 1;
    $(".resetField").val("");
    this.addCatId = this.category;
    let catObj = this.categoryList.filter((x: { catId: any; }) => x.catId == this.addCatId)[0];
    this.addCatName = catObj.catName;
    this.closeAnyModal("viewRestModal");
    this.openAnyModal("addItemModal");
  }

  cancelAddItemModel(){
    this.closeAnyModal("addItemModal");
    this.openAnyModal("viewRestModal");
    this.addMore = 1;
  }

  showUnit(itemId:any){
    let customize = $("#itemCustomize"+itemId).val();
    if(customize == ""){
      return [];
    }
    customize = parseInt(customize);
    let unitObj = this.unitList.filter((x: { custId: any; }) => x.custId === customize)[0];
    return unitObj.unit;
  }

  moreItemList:any = [];
  submitItem(){
    this.moreItemList = [];
    for(let i=0;i<this.addMore;i++){
      let id = i+1;
      let itemName = $("#itemName"+id).val();
      let itemImage = $("#txt_itemImage"+id).val();
      let itemCustomize = $("#itemCustomize"+id).val();
      if(itemName.trim() == ""){
        this.layout.warningSnackBar("enter name of "+id);
        $("#itemName"+id).focus();
        return;
      }
      else if(itemImage == ""){
        this.layout.warningSnackBar("select a image of "+id);
        $("#itemName"+id).focus();
        return;
      }
      else if(itemCustomize == ""){
        this.layout.warningSnackBar("select customize of "+id);
        $("#itemCustomize"+id).focus();
        return;
      }

      let itemUnit = [];
      itemCustomize = parseInt(itemCustomize);
      let unitObj = this.unitList.filter((x: { custId: any; }) => x.custId === itemCustomize)[0];
      let unitList = unitObj.unit;
      for(let j=0;j<unitList.length;j++){
        let unit = unitList[j];
        let itemData = $("#item"+unit+""+id).val();
        if(itemData.trim() == ""){
          $("#item"+unit+""+id).focus();
          this.layout.warningSnackBar("enter "+unit+" of "+id);
          break;
        }
        else{
          let unitJson = {
            title:unit,
            price: itemData
          }
          itemUnit.push(unitJson);
        }
      }
      if(itemUnit.length == 0){
        return
      }
      else{
        let itemJson = {
          id: id,
          name: itemName,
          image: itemImage,
          customize: itemCustomize,
          unitList: itemUnit
        }
        this.moreItemList.push(itemJson);
      }
    }
    let jsonData = {
      insertType: "moreItem",
      restId: this.viewRestId,
      catId: this.addCatId,
      itemList: this.moreItemList
    }
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.resetRestItemId();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message);
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("moreItem"))
      }
    })
    
  }

  resetRestItemId(){
    let jsonData = {
      searchType: "restaurantItem",
      restId: this.viewRestId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.closeAnyModal("addItemModal");
        this.openAnyModal("viewRestModal");
        this.restItemList = result;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurantItem"))
      }
    })
  }

  deleteItem(itemId:any){
    let isConfirm = confirm("Are u sure want to delete this item?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      deleteType: "restItem",
      itemId: itemId
    }
    this.sharedService.deleteData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.resetRestItemId();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restItem"))
      }
    })
  }

  addMore: any=1;
  addMoreItem(){
    this.addMore++;
  }
  removeItem(){
    if(this.addMore > 1){
      this.addMore--;
    }
    
  }
  createRange(number:any){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  addNewCategory(){
    this.closeAnyModal("viewRestModal");
    this.openAnyModal("newCategoryModal");
  }

  submitCategory(){
    let jsonData ={
      insertType: "addCategory",
      category: this.newCatName,
      imageBase64: this.catImageBase64
    }
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.getAllCategory();
          this.closeAndOpenModal('newCategoryModal','viewRestModal');
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("addCategory"))
      }
    })
  }

  getCategoryItem(){
    if(this.category == ""){
      this.tempRestItemList = this.restItemList;
      return;
    }
    this.tempRestItemList = this.restItemList.filter((x: { catId: any; }) => x.catId === this.category);
  }

  catImageBase64: any="";
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

        if (width > this.imgWidth || height > this.imgHeight) {
          alert('Image dimensions must be less equal to ('+this.imgWidth+'x'+this.imgHeight+')px.');
        } else {
          // You can proceed with the image upload here
          alert('Image dimensions are valid.');
          // Example: call a function to upload the image.
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
      if(imageId == 0){
        this.catImageBase64 = image;
      }
      else{
        $("#txt_itemImage"+imageId).val(image);
      }
      
      if(wrongFile){
        if(imageId == 0){
          this.catImageBase64 = "";
          $("#file_catImage").val("");
        }
        else{
          $("#file_itemImage"+imageId).val("");
          $("#txt_itemImage"+imageId).val("");
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  viewRestImage(restImgUrl:any){
    this.viewImgUrl = restImgUrl;
    this.openAnyModal("restImageModal");
  }

  viewImgUrl: any = ""
  viewImage(imgUrl:any){
    this.viewImgUrl = imgUrl;
    this.closeAndOpenModal('viewRestModal','imageModal');
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

  closeAndOpenModal(closeModalId:any, openModalId:any){ 
    this.closeAnyModal(closeModalId);
    this.openAnyModal(openModalId);
  }
}
