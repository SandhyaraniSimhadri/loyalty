import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";
import { cloneDeep } from "lodash";
import { UserEditService } from "./user-edit.service";
import { CoreHttpService } from "@core/services/http.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { ModalsService } from "@core/services/modals.service";
import { isEqual } from 'lodash';

@Component({
  selector: "app-events-edit",
  templateUrl: "./events-edit.component.html",
  styleUrls: ["./events-edit.component.scss"],
 
})
export class EventsEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  public image: any;
  public apiUrl: any;
  public loading:boolean=false;
  public churchData:any;
  public buttonLoading:boolean=false;
  @ViewChild("accountForm") accountForm: NgForm;
  public membersData: any;
  public originalFormValues: any;
  public formModified: boolean = false;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };

  public selectMultiLanguages = [
    "English",
    "Spanish",
    "French",
    "Russian",
    "German",
    "Arabic",
    "Sanskrit",
  ];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(
    private router: Router,
    private _userEditService: UserEditService,
    private http: HttpClient,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,
    private _router: Router,
    public modalsService:ModalsService,

  ) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
    this.formModified = false;

  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    this.loading=true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.currentRow.avatar = event.target.files[0].name;
      this.image = event.target.files[0];
    }
    this.loading=false;
    this.checkFormModified();

  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    this.buttonLoading=true;
    if (form.valid) {
      const formData = new FormData();
      formData.append("image", this.image);
      formData.append("id", this.currentRow.id);
   
      formData.append("title", this.currentRow.title);
      formData.append("description", this.currentRow.description);
      formData.append("terms_conditions", this.currentRow.terms_conditions);


      this.currentRow.image = this.image;
      this.http
        .post<any>(this.apiUrl+"api/update_event", formData)
        .subscribe(
          (res: any) => {
            if (res == "nonet") {
            } else {
              if (res.status == false) {
                this._toastrService.error(res.msg, "Failed", {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                });
              } else if (res.status == true) {
                this._toastrService.success(
                  res.msg,
                  'Success',
                  { toastClass: 'toast ngx-toastr', closeButton: true }
                );
                this._router.navigate(["/events/events"]);
              }
            }
            this.buttonLoading=false;
          },
          (error: any) => {
            this.buttonLoading=false;
          }
        );
    }
    else{
      this.buttonLoading=false;
    }
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
  
    this.getSingleRequest();
  }
  getSingleRequest() {
  
    this.loading=true;
    let request;

    request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_event",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
        

            this.currentRow = this.modalsService.replaceNullsWithEmptyStrings(res.data);
            this.originalFormValues = { ...this.currentRow };
          
            if(this.currentRow.avatar){
            this.avatarImage = this.apiUrl+this.currentRow.avatar;}
            this.tempRow = cloneDeep(this.currentRow);
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
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  checkFormModified() {

    this.formModified = !isEqual(this.currentRow, this.originalFormValues);
  }
}
