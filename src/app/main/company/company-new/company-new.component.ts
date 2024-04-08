import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-company-new",
  templateUrl: "./company-new.component.html",
  styleUrls: ["./company-new.component.scss"],
  encapsulation: ViewEncapsulation.None,
 
})
export class CompanyNewComponent implements OnInit {
  @Output() onCompanyAdded: EventEmitter<any> = new EventEmitter<any>();

  public company_name;
  public business_entity;
  public business_address;
  public mailing_address;
  public bus_contact_number;
  public email;
  public website;
  public full_name;
  public title;
  public primary_email;
  public primary_contact_number;
  public business_nature;
  public industry_sector;
  public revenue;
  public employees;
  public form: any;
  public adminsData: any;
  public loading: boolean = false;

  public status: boolean = true;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    public httpService: CoreHttpService,
    private router: Router,
    private _toastrService: ToastrService,
    private _router: Router,
  ) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    console.log("submmited");
    this.loading = true;
    this.form = {
      company_name: this.company_name,
      website: this.website,
      business_entity: this.business_entity,
      business_address: this.business_address,
      mailing_address: this.mailing_address,
      bus_contact_number: this.bus_contact_number,
      email: this.email,
      full_name: this.full_name,
      title: this.title,
      primary_email: this.primary_email,
      primary_contact_number: this.primary_contact_number,
      business_nature: this.business_nature,
      industry_sector: this.industry_sector,
      revenue: this.revenue,
      employees: this.employees,
    };
    if (form.valid) {
      let request;

      request = {
        params: this.form,
        action_url: "add_company",
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
              this.onCompanyAdded.emit(res.data);

              this._toastrService.success(res.msg, "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
              this._router.navigate(["../company"]);
            }
          }
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }

  ngOnInit(): void {}
}
