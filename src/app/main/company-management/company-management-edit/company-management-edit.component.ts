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
import { isEqual } from "lodash";

@Component({
  selector: "app-company-management-edit",
  templateUrl: "./company-management-edit.component.html",
  styleUrls: ["./company-management-edit.component.scss"],
})
export class CompanyManagementEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  public image: any;
  public apiUrl: any;
  public loading: boolean = false;
  public adminsData: any;
  public buttonLoading: boolean = false;
  @ViewChild("accountForm") accountForm: NgForm;
  public customTag: any[] = [];
  public customTagselected: any = [];
  public admins_list: any = [];
  public originalFormValues: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };
  formModified: boolean = false;
  public selectMultiLanguages = [
    "English",
    "Spanish",
    "French",
    "Russian",
    "German",
    "Arabic",
    "Sanskrit",
  ];
  public countriesData: any;
  public citiesData: any;
  public selected_country: any;
  public selectMultiLanguagesSelected = [];
  public selectedMembers: any = [];

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
    private _router: Router
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
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.currentRow.image = event.target.files[0].name;
      this.image = event.target.files[0];
    }
    this.loading = false;
    this.checkFormModified();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    var i = 0;
   
    this.buttonLoading = true;
    if (form.valid) {
      const formData = new FormData();
      formData.append("image", this.image);

      // Append form data fields
      formData.append("id", this.currentRow.id);

      formData.append("company_name", this.currentRow.company_name);
      formData.append("business_entity_type", this.currentRow.business_entity_type);
      formData.append("business_address", this.currentRow.business_address);
      formData.append("mailing_address", this.currentRow.mailing_address);
      formData.append("business_phone_number", this.currentRow.business_phone_number);
      formData.append("email_address", this.currentRow.email_address);
      formData.append("website", this.currentRow.website);
      formData.append("full_name", this.currentRow.full_name);
      formData.append("title", this.currentRow.title);
      formData.append("primary_email", this.currentRow.primary_email);
      formData.append("primary_phone_number", this.currentRow.primary_phone_number);
      formData.append("business_nature", this.currentRow.business_nature);
      formData.append("industry_sector", this.currentRow.industry_sector);
      formData.append("revenue", this.currentRow.revenue);
      formData.append("employees", this.currentRow.employees);

      


      let request;
      this.currentRow.image = this.image;
      request = {
        params: { row: this.currentRow, file: formData },
        action_url: "update_company",
        method: "POST",
      };
      this.http
        .post<any>(this.apiUrl + "api/update_company", formData)
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
                this._toastrService.success(res.msg, "Success", {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                });
                this._router.navigate(["../company-management"]);
              }
            }
            this.buttonLoading = false;
            this.formModified = false;
          },
          (error: any) => {
            this.buttonLoading = false;
          }
        );
    } else {
      this.buttonLoading = false;
    }
  }

  checkFormModified() {
    let formModified1 = false;
    let formModified2 = false;
    formModified1 = !isEqual(this.currentRow, this.originalFormValues);
    formModified2 = !isEqual(this.customTagselected, this.selectedMembers);
    if (formModified1 || formModified2) {
      this.formModified = true;
    } else {
      this.formModified = false;
    }
  }

  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getSingleCompany();
  }
  getSingleCompany() {
    this.loading = true;
    let request;

    request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_company",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.currentRow = res.data;
            if (this.currentRow.image) {
              this.avatarImage = this.apiUrl + this.currentRow.image;
            }
            this.tempRow = cloneDeep(this.currentRow);
            this.originalFormValues = { ...this.currentRow };
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
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
}
