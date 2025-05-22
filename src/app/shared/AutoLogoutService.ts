import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Constant } from '../constant/Constant';

@Injectable({ providedIn: 'root'})
export class AutoLogoutService {
    public getLastAction() {
        return parseInt(localStorage.getItem(Constant.STORE_KEY)!);
    }

    public setLastAction(lastAction: number) {
        localStorage.setItem(Constant.STORE_KEY, lastAction.toString());
    }

    constructor(private router: Router) {
        //console.log('object created');
        this.check();
        this.initListener();
        this.initInterval();
      }

      initListener() {
        document.body.addEventListener('click', () => this.reset());
        // document.body.addEventListener('mouseover',()=> this.reset());
        // document.body.addEventListener('mouseout',() => this.reset());
        document.body.addEventListener('keydown',() => this.reset());
        document.body.addEventListener('keyup',() => this.reset());
        document.body.addEventListener('keypress',() => this.reset());
      }

      reset() {
          // console.log("hello");
        this.setLastAction(Date.now());
      }
    
      initInterval() {
        setInterval(() => {
          this.check();
        }, Constant.CHECK_INTERVAL);
      }

      check() {
         // alert("checking");
        const now = Date.now();
        const timeleft = this.getLastAction() + Constant.MINUTES_UNTIL_AUTO_LOGOUT * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;
    
        // if (isTimeout && this.auth.loggedIn)
        if (isTimeout)  {
            alert("You're being timed out due to inactivity.\nPlease Login again");
            localStorage.clear();
            this.router.navigate(['/login']);
        }
      }
}