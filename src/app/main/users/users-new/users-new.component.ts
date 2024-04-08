import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-users-new",
  templateUrl: "./users-new.component.html",
  styleUrls: ["./users-new.component.scss"],
  encapsulation: ViewEncapsulation.None,
 
})
export class UsersNewComponent implements OnInit {
  @Output() onUserAdded: EventEmitter<any> = new EventEmitter<any>();

  public form: any;

  public loading: boolean = false;
  public image: any;
  public apiUrl: any;
  public imageval: any;
  public company_id: any;
  public name: any;
  public email: any;
  public phone: any;
  public city: any;
  public companyData: any;

  public description: any;

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
    private http: HttpClient,
    private _router: Router,
  ) {
    if (this.httpService.USERINFO.role == "Sub Admin") {
    }
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this.getData();
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  getData() {
    let request = {
      params: null,
      action_url: "get_companies",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.companyData = res.data;
          }
        }
      },
      (error: any) => {}
    );
  }
  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    this.loading = true;
    const formData = new FormData();

    formData.append("company_id", this.company_id);
    formData.append("name", this.name);
    formData.append("email", this.email);
    formData.append("phone", this.phone);
    formData.append("city", this.city);

    if (form.valid) {
      this.http.post<any>(this.apiUrl + "api/add_user", formData).subscribe(
        (res: any) => {
          if (res == "nonet") {
          } else {
            if (res.status == false) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else if (res.status == true) {
              this.onUserAdded.emit(res.data);

              this._toastrService.success(res.msg, "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
              this._router.navigate(["../users"]);
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
    this.loading = false;
  }

  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getData();
  }

  uploadImage(event: any) {
    this.loading = true;
    this.image = event.target.files[0];
    this.loading = false;
  }
}
