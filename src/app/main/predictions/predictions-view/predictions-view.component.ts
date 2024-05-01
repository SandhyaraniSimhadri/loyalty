import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CoreHttpService } from '@core/services/http.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-predictions-view',
  templateUrl: './predictions-view.component.html',
  styleUrls: ['./predictions-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PredictionsViewComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public lastValue;
  public data;
  public apiUrl:any;
  public loading:boolean=false;
  public buttonLoading:boolean=false;



  /**
   * Constructor
   *
   * @param {Router} router

   */
  constructor(private router: Router,   public httpService: CoreHttpService,private _toastrService: ToastrService,   ) {
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.apiUrl=environment.apiUrl;
    this.getSingleAdmin();
  }
  getSingleAdmin(){
    this.loading=true;
    let request;

    request = {
      params: {id:this.lastValue},
      action_url: "get_single_company",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.data=res.data;
          

          }
        }
        this.loading=false;
      },
      (error: any) => {
        this.loading=false;
      }
    );
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
  }

  delete(id: any) {
    this.buttonLoading=true;
    let request = {
      params: { id: id },
      action_url: "delete_company",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this._toastrService.success(res.msg, "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.router.navigate(["../company"]);
          }
        }
    this.buttonLoading=false;
      },
      (error: any) => {
    this.buttonLoading=false;

      }
    );
  }
}
