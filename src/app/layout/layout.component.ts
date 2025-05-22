import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  loginEmpName: any = "";
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private router: Router,
    private _snackBar: MatSnackBar,
    private _title:Title,
    private _spinner: NgxSpinnerService){
      this.loginEmpName = localStorage.getItem("loginEmpName");
    }

  setPageTitle(pageTitle : string){
    this._title.setTitle("Pickaro | "+pageTitle);
  }
  spinnerShow(){
    this._spinner.show();
  }
  spinnerHide(){
    this._spinner.hide();
  }

  successSnackBar(alertMsg:any) {
    this._snackBar.open(alertMsg, 'Close', {
      duration: 3 * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['success-snackbar']
    });
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

  logout(){
    let isConfirm = confirm("You want to logout?");
    if(!isConfirm){
      return;
    }
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
