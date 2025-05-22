import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { SharedService } from 'src/app/shared/SharedService';
import { LayoutComponent } from '../layout.component';
import { Constant } from 'src/app/constant/Constant';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { CommonFunction } from 'src/app/shared/CommonFunction';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'app-common-page',
  templateUrl: './common-page.component.html',
  styleUrls: ['./common-page.component.scss']
})
export class CommonPageComponent implements OnInit {
  @ViewChild(PaginationComponent) myPagination: any;
  imgWidth: number = 0;
  imgHeight: number = 0; 
  restImgInfo: string = "";
  catImgInfo: string = "Category image width and height dimension must be equal";
  itemImgInfo: string = "Item width and height dimension must be equal";
  restDisplayOrder: number = 0;
  restId: any = "";
  restData: any = "";
  restName: any = "";
  restMobile: any = "";
  restAddress: any = "";
  restPincode: any = "";
  restLatLong: any = "";
  restOpenTime: any = "";
  restCloseTime: any = "";
  restImage: any = "";
  restBanner: any = "";
  itemList: any = [];
  searchItemList: any = [];
  categoryList: any = [];
  unitList: any = [];
  isItemLoaded: boolean = false;
  noItemFound: boolean = false;
  constructor(private activeRoute: ActivatedRoute, private layout:LayoutComponent, 
    private sharedService: SharedService){
      this.imgWidth = Constant.IMG_WIDTH;
      this.imgHeight = Constant.IMG_HEIGHT;
      this.restImgInfo = "Image dimension should be equal to ("+this.imgWidth+"x"+this.imgHeight+")px";
    $(document).ready(function(){
      $('.turn').on('click', function(){
        var angle = ($('.viewImg').data('angle') + 90) || 90;
        $('.viewImg').css({'transform': 'rotate(' + angle + 'deg)'});
        $('.viewImg').data('angle', angle);
      });
    })

  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(param =>{
      this.restId = param.get("restId");
      this.searchItemName = "";
      this.searchCategory = "";
      this.getAllCategory();
      this.getRestaurantData();
    })
  }
  getAllCategory(){
    let jsonData = {
      searchType:"allCategory",
      restId: this.restId
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
  getRestaurantData(){
    this.layout.spinnerShow();
    let jsonData = {
      searchType: "restaurantData",
      restId: this.restId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restData = result;
        this.layout.setPageTitle(this.restData.name);
        this.layout.spinnerHide();
        this.resetItemList();
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurantData"));
        this.layout.spinnerHide();
      }
    })
  }

  actionOnRestaurant(){
    let jsonData = {
      searchType: "restaurantData",
      restId: this.restId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restData = result;
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("restaurantData"))
      }
    })
  }

  deleteItem(itemId:any){
    let isConfirm = confirm("Are u sure want to delete this item?");
    if(!isConfirm){
      return;
    }
    let jsonData = {
      updateType: "deleteRestItem",
      itemId: itemId
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.resetItemList();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("deleteRestItem"))
      }
    })
  }

  editItemId:any = "";
  editItemObj:any;
  editCatId: any ="";
  editItemName: any ="";
  editCustomize: any ="";
  editItemUnitList:any=[];
  editItem(itemObj:any){
    this.editItemObj = itemObj;
    this.editItemId = itemObj.itemId;
    this.editCatId = itemObj.catId;
    this.editItemName = itemObj.itemName;
    this.editCustomize = itemObj.customize;
    this.editItemUnitList = itemObj.itemUnitList;
    this.openAnyModal("editItemModal");
  }

  selectCateList: any = [];
  selectCategory(catId:any, catName:any){
    let isChecked = $("#cat"+catId).prop("checked");
    if(isChecked){
      let catJson = {
        catId: catId, catName:catName
      }
      this.selectCateList.push(catJson);
    }
    else{
      let newList = this.selectCateList.filter((object: { catId: any; }) =>{
        return object.catId !== catId;
      });
      this.selectCateList = newList;
    }
  }

  addCatItem(){
    this.openAnyModal("addItemModal");
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
  showUnit(itemId:any){
    let customize = $("#itemCustomize"+itemId).val();
    if(customize == ""){
      return [];
    }
    customize = parseInt(customize);
    let unitObj = this.unitList.filter((x: { custId: any; }) => x.custId === customize)[0];
    return unitObj.unit;
  }
  isOriginal: boolean = true;
  newEditUnitList:any = [];
  showEditUnit(){
    if(this.editItemObj.customize == this.editCustomize){
      this.isOriginal = true;
    }
    else{
      this.isOriginal = false;
      let customize = this.editCustomize;
      if(customize == ""){
        return [];
      }
      customize = parseInt(customize);
      let unitObj = this.unitList.filter((x: { custId: any; }) => x.custId === customize)[0];
      this.newEditUnitList = unitObj.unit;
      return this.newEditUnitList;
    }
  }
  createRange(number:any){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }
  saveItem(){
    let newUnitList = [];
    if(this.isOriginal){
      for(let i=0;i<this.editItemUnitList.length;i++){
        let obj = this.editItemUnitList[i];
        let objVal = $("#editUnit_"+obj.itemUnitId).val();
        if(objVal.trim() != ""){
          let unitJson = {
            title: obj.unit,
            price: objVal
          }
          newUnitList.push(unitJson);
        }  
      }
    }
    else{
      for(let i=0;i<this.newEditUnitList.length;i++){
        let obj = this.newEditUnitList[i];
        let objVal = $("#editUnit_"+obj).val();
        if(obj == "1.5KG"){
          objVal = $("#editUnit_1500Gram").val();
        }
        if(objVal.trim() != ""){
          let unitJson = {
            title: obj,
            price: objVal
          }
          newUnitList.push(unitJson);
        } 
      }
    }
    if(newUnitList.length == 0){
      this.layout.warningSnackBar("Please enter one unit price");
      return;
    }
    let jsonData = {
      updateType: 'updateItem',
      restId: this.restId,
      itemId: this.editItemId,
      name: this.editItemName,
      catId: this.editCatId,
      customize:this.editCustomize,
      image64: this.editItemImageBase64,
      unitList: newUnitList
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.closeAnyModal('editItemModal')
          $(".resetField").val("");
          this.resetItemList();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message);
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("updateItem"))
      }
    })
  }
  moreItemList: any = [];
  submitItem(){
    this.moreItemList = [];
    for(let i=0;i<this.addMore;i++){
      let id = i+1;
      let itemCategory = $("#itemCategory"+id).val();
      let itemName = $("#itemName"+id).val();
      let itemImage = $("#txt_itemImage"+id).val();
      let itemCustomize = $("#itemCustomize"+id).val();
      if(itemCategory.trim() == ""){
        this.layout.warningSnackBar("Select category");
        $("#itemCategory"+id).focus();
        return;
      }
      else if(itemName.trim() == ""){
        this.layout.warningSnackBar("Enter name");
        $("#itemName"+id).focus();
        return;
      }
      else if(itemImage == ""){
        this.layout.warningSnackBar("Select a image");
        $("#file_itemImage"+id).focus();
        return;
      }
      else if(itemCustomize == ""){
        this.layout.warningSnackBar("Select unit");
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
        if(unit == "1.5KG"){
          itemData = $("#item1500Gram"+id).val();
        }
        if(itemData.trim() == ""){
         
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
        this.layout.warningSnackBar("Please enter one unit price  of "+id+" row");
        return
      }
      else{
        let itemJson = {
          id: id,
          catId: itemCategory,
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
      restId: this.restId,
      itemList: this.moreItemList
    }
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.closeAnyModal('addItemModal')
          $(".resetField").val("");
          this.resetItemList();
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
          this.actionOnRestaurant();
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

  resetItemList(){
    this.itemList = [];
    this.searchItemList = [];
    this.isItemLoaded = true;
    let jsonData = {
      searchType: "resetItemList",
      restId: this.restId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.itemList = result;
        this.searchItemList = this.itemList;
        this.isItemLoaded = false;
        this.searchItem("");
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("resetItemList"))
      }
    })
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
    return true;
  }

  saveRestaurant(){
    if(!this.validateRestData()){
      return;
    }
    let jsonData = {
      updateType: "editRestaurant",
      restId: this.restId,
      name: this.restName,
      mobile: this.restMobile,
      address: this.restAddress,
      pincode: this.restPincode,
      latlong: this.restLatLong,
      image64:this.restImageBase64,
      banner64:this.restBannerBase64,
      openTime:this.restOpenTime,
      closeTime:this.restCloseTime,
      displayOrder: this.restDisplayOrder
    }
    this.sharedService.updateData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.layout.successSnackBar(result.message);
          this.closeAnyModal("editRestModal");
          this.actionOnRestaurant();
        }
        else{
          this.layout.warningSnackBar(result.message)
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("editRestaurant"))
      }
    })
  }

  catImageBase64: any="";
  restImageBase64: any="";
  restBannerBase64: any="";
  editItemImageBase64: any="";
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

        if(imageId == "catImage" && width != height){
          this.catImageBase64 = "";
          $("#file_catImage").val("");
          alert('Width('+width+') and Height('+height+') dimensions must be equal');
        }

        else if((imageId == "restImage" || imageId == "restBanner") && 
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
        else if(imageId > 0 && width != height){
          if(imageId == "editItemImage"){
            this.editItemImageBase64 = "";
            $("#editItemImageBase64").val("");
          }
          else{
            $("#file_itemImage"+imageId).val("");
            $("#txt_itemImage"+imageId).val("");
          } 
          alert('Width('+width+') and Height('+height+') dimensions must be equal');
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
      else if(imageId == "editItemImage"){
        this.editItemImageBase64 = image;
      }
      else if(imageId == "catImage"){
        this.catImageBase64 = image;
      }
      else{
        $("#txt_itemImage"+imageId).val(image);
      }
      
      if(wrongFile){
        this.restImageBase64 = "";
        this.restBannerBase64 = "";
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

  
  typeId: any;
  addNewCategory(typeId:any){
    this.typeId = typeId;
    this.closeAnyModal("addItemModal");
    this.openAnyModal("newCategoryModal");
  }

  newCatName:any = "";
  oldCatName:any = "";
  submitCategory(){
    if(this.newCatName.trim() == ""){
      this.layout.warningSnackBar("Please enter category name");
      return;
    }
    // else if(this.catImageBase64 == ""){
    //   this.layout.warningSnackBar("Please select category image");
    //   return;
    // }
    let jsonData ={
      insertType: "addCategoryNew",
      restId: this.restId,
      category: this.newCatName,
      oldCategory: this.oldCatName,
      imageBase64: this.catImageBase64
    }
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.newCatName = "";
          this.oldCatName = "";
          this.catImageBase64 = "";
          $(".resetField").val("");
          this.getAllCategory();
          // this.closeAndOpenModal('newCategoryModal','addItemModal');
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message);
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("addCategory"))
      }
    })
  }

  viewImgUrl: any = ""
  viewImage(imgUrl:any){
    this.viewImgUrl = imgUrl;
    this.openAnyModal('imageModal');
  }

  editViewRestData(){
    this.openAnyModal("editRestModal");
    this.restName = this.restData.name;
    this.restMobile = this.restData.mobile;
    this.restAddress = this.restData.address;
    this.restPincode = this.restData.pincode;
    this.restLatLong = this.restData.latLong;
    this.restOpenTime = this.restData.openTime;
    this.restCloseTime = this.restData.closeTime;
    this.restDisplayOrder = this.restData.displayOrder;
  }

  searchItemName:any = "";
  searchCategory:any = "";
  searchIsEnable:any = "";
  searchItem(evt:any){
    this.searchItemList = this.itemList.filter
    (
      (
        x: { 
          itemName: any;
          catName: any;
          enableTxt:any 
        }
      ) => 
        x.itemName.toLowerCase().includes(this.searchItemName.toLowerCase()) && 
        x.catName.toLowerCase().includes(this.searchCategory.toLowerCase()) && 
        x.enableTxt.toLowerCase().includes(this.searchIsEnable.toLowerCase())
    );

    if(this.searchItemList.length == 0){
      this.noItemFound = true;
    }
    else{
      this.noItemFound = false;
    }
    this.myPagination.itemCount = this.searchItemList.length;
    this.myPagination.createPagination();
  }

  exportItem(){
    if(this.searchItemList.length != 0 ){
      let columnKeyArr:any = ["itemName","catName","itemUnit"];
      let columnTitleArr:any = ["Name","Category","Customize"];
      CommonFunction.downloadFile(this.searchItemList,
        'Item.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

  exportCategory(){
    if(this.categoryList.length != 0 ){

      let tempCatList = [];
      for(let i=1;i<this.categoryList.length;i++){
        let catObj = this.categoryList[i];
        let tempJson = {
          sr:i,
          catName: catObj.catName
        } 
        tempCatList.push(tempJson);
      }
      let columnKeyArr:any = ['sr',"catName"];
      let columnTitleArr:any = ["SR","Category"];
      CommonFunction.downloadFile(tempCatList,
        'Category.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
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

  importItem(){
    this.openAnyModal("importItemModal");
  }

  downloadFormat(){
    let link = Constant.phpServiceURL+"/Format/ImportItem.xlsx";
    window.open(link);
  }

  arrayBuffer:any;
  importData = [];
  addfile(event:any)     
  {    
    let file= event.target.files[0];     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(file);     
    fileReader.onload = (e) => {    
        this.arrayBuffer = fileReader.result;    
        var data = new Uint8Array(this.arrayBuffer);    
        var arr = new Array();    
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
        var bstr = arr.join("");    
        var workbook = XLSX.read(bstr, {type:"binary"});    
        var first_sheet_name = workbook.SheetNames[0];    
        var worksheet = workbook.Sheets[first_sheet_name];
        this.importData = XLSX.utils.sheet_to_json(worksheet,{raw:false,dateNF: "yyyy-MM-dd"});      
    }    
  }

  uploadItemData(){
    if(this.importData.length == 0){
      this.layout.warningSnackBar("please select file first");
      return ;
    }
    
    let jsonData = {
      insertType: "importItem",
      restId: this.restId,
      importData: this.importData
    }
    // console.log(JSON.stringify(jsonData))
    this.sharedService.insertData(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          this.closeAnyModal('importItemModal');
          this.importData = [];
          $("#locationFile").val("");
          this.resetItemList();
          this.layout.successSnackBar(result.message);
        }
        else{
          this.layout.warningSnackBar(result.message);
        }
      },
      error: _=>{
        this.layout.errorSnackBar(Constant.returnServerErrorMessage("importItem"))
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
  closeAndOpenModal(closeModalId:any, openModalId:any){ 
    this.closeAnyModal(closeModalId);
    if(this.typeId == 1){
      this.openAnyModal(openModalId);
    }
  }
}
