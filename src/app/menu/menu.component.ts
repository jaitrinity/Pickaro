import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/SharedService';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  loginEmpRoleId: any = "";
  menuList: any = [];
  restMenuList: any = [];
  constructor(private sharedService: SharedService, private router: Router){
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
  }
  ngOnInit(): void {
    this.getMenuList();
    // this.getRestMenuList();
  }

  getMenuList(){
    let jsonData = {
      searchType: "menuList",
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.menuList = result;
        // this.loadFirstMenu();
      },
      error: _=>{
        alert("Something wrong in menuList service")
      }
    })
  }

  // loadFirstMenu(){
  //   let firstMenu = this.menuList[0].routerLink;
  //   this.router.navigate(['/layout/'+firstMenu]);
  // }

  getRestMenuList(){
    let jsonData = {
      searchType: "restaurantMenu",
    }
    this.sharedService.getAllList(jsonData)
    .pipe(take(1)).subscribe({
      next: result=>{
        this.restMenuList = result;
      },
      error: _=>{
        alert("Something wrong in restaurantMenu service")
      }
    })
  }


}
