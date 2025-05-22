import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Constant } from "../constant/Constant";

@Injectable({ providedIn: 'root'})
export class SharedService{
    private appUrl = Constant.phpServiceURL;
    constructor(private http: HttpClient){}

    public autherization(jsonData : any) : Observable<any>{
        return this.http.post<any>(this.appUrl+"portalAuth.php",jsonData);
    }

    public getAllList(jsonData : any) : Observable<any>{
        return this.http.post<any>(this.appUrl+"getAllList.php",jsonData);
    }

    public updateData(jsonData : any) : Observable<any>{
        return this.http.post<any>(this.appUrl+"updateData.php",jsonData);
    }

    public insertData(jsonData : any) : Observable<any>{
        return this.http.post<any>(this.appUrl+"insertData.php",jsonData);
    }

    public deleteData(jsonData : any) : Observable<any>{
        return this.http.post<any>(this.appUrl+"deleteData.php",jsonData);
    }

    public changeOrderStatus(jsonData : any) : Observable<any>{
        return this.http.post<any>(this.appUrl+"changeOrderStatus.php",jsonData);
    }
}