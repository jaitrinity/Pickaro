import { Component } from '@angular/core';
import { AuthenticateModel } from './model/AuthenticateModel';
import { Constant } from '../constant/Constant';
import { Router } from '@angular/router';
import { SharedService } from '../shared/SharedService';
import { take } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AutoLogoutService } from '../shared/AutoLogoutService';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  invalid = false;
  isShow: boolean = false;
  public loginModel: any;
  constructor(private router: Router,
    private sharedService: SharedService, 
    private _title: Title,
    private _snackBar: MatSnackBar,
    private autoLogoutService  : AutoLogoutService){
    _title.setTitle("Pickaro | Login")
    this.loginModel = new AuthenticateModel();
  }

  errorSnackBar(alertMsg:any) {
    this._snackBar.open(alertMsg, 'Close', {
      duration: 3 * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['error-snackbar']
    });
  }
  warningSnackBar(alertMsg:any) {
    this._snackBar.open(alertMsg, 'Close', {
      duration: 3 * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['warning-snackbar']
    });
  }

  login(){
    this.sharedService.autherization(this.loginModel)
    .pipe(take(1)).subscribe({
      next: result=>{
        if(result.code == Constant.SUCCESSFUL_STATUS_CODE){
          let userInfo = result.userInfo;
          localStorage.setItem("loginUserId",userInfo.userId);
          localStorage.setItem("loginEmpName",userInfo.name);
          localStorage.setItem("loginEmpRoleId",userInfo.roleId);
          localStorage.setItem(btoa("isValidTokenPickup"),btoa(Constant.PICKARO_PRIVATE_KEY));
          if(userInfo.roleId == "2"){
            this.router.navigate(['/layout/orders']);
          }
          else if(userInfo.roleId == "3"){
            this.router.navigate(['/layout/allRestaurant']);
          }
          else{
            this.router.navigate(['/layout']);
          }
        }
        else{
          this.warningSnackBar(result.message);
        }
      },
      error: _=>{
        this.errorSnackBar(Constant.returnServerErrorMessage("login"))
      }
    })
    
  }

}
