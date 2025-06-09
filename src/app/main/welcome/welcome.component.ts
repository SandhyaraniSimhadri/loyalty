import { Component, NgZone, OnInit, ViewEncapsulation } from "@angular/core";

import { CoreConfigService } from "@core/services/config.service";
import { CoreHttpService } from "@core/services/http.service";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { environment } from "environments/environment";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class WelcomeComponent implements OnInit {
  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */

  public loading = false;
  public section: any = 1;
  public avatarImage: any = null;
  public image: any;
  public user_info: any;
  public apiUrl: any;
  public campaign_id: any = null;
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public old_password:any;
  public new_password:any;
  public confirm_password:any;
  public welcome_image:any;
  public welcome_text:any=null;
  public event_id:any;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _toastrService: ToastrService,
    private http: HttpClient,
    public httpService: CoreHttpService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {


    console.log("section", this.section);

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.user_info = this.httpService.USERINFO;
    this.avatarImage = this.user_info.avatar;
    if(this.avatarImage){
      this.avatarImage= this.apiUrl +this.avatarImage;
    }
    console.log("user infooo", this.user_info);
    this.section = 1;
    this._route.queryParams.subscribe((params) => {
      if (params) {
        this.campaign_id=params['campaign_id'];
        if(params['welcome_image']){
          this.welcome_image=params['welcome_image'];
        }
        if(params['welcome_text']){
          this.welcome_text=params['welcome_text'];
        }
        if(params['event_id']){
          this.event_id=params['event_id'];
        }
      }});
      console.log("welcome text",this.welcome_text);
  }

  ngOnDestroy(): void {}

  goToNext() {
    if (this.section == 1) {
      this.section=2;
    } else if (this.section == 2) {
      if (this.avatarImage == null) {
        if(this.httpService.USERINFO.user_type==1){
          this._router.navigate(["/company/company"]);
        }
      else{
        this._router.navigate(["/predictions/predictions"], {
          queryParams: { campaign_id: this.campaign_id, event_id:this.event_id },
        });
      }
      } else {
        this.save();
      }
    }
  }
  triggerFileInput() {
    const fileInput = document.getElementById("upload");
    if (fileInput) {
      fileInput.click();
    }
  }
  uploadImage(event: any) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);

      this.image = event.target.files[0];
    }
    this.loading = false;
  }
  save() {
    var i = 0;

    this.loading = true;

    const formData = new FormData();
    if(this.image==undefined || this.image==null){
      if(this.httpService.USERINFO.user_type==1){
        this._router.navigate(["/company/company"]);
      return;

      }
    else{
      this._router.navigate(["/predictions/predictions"], {
        queryParams: { campaign_id: this.campaign_id , event_id:this.event_id},
      });
      return;
    }
    }
    formData.append("image", this.image);
    formData.append("id", this.user_info.id);
    formData.append("email", this.user_info.email);
    formData.append("phone_number", this.user_info.mobile_no);
    formData.append("user_name", this.user_info.user_name);
    formData.append("name", this.user_info.name);
    this.http
      .post<any>(this.apiUrl + "api/update_user_info", formData)
      .subscribe(
        (res: any) => {
          if (res == "nonet") {
          } else {
            if (res.status == false) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
               this.loading = false;
            } else if (res.status == true) {
              this._toastrService.success(res.msg, "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
               this.loading = false;
              this.httpService.USERINFO.avatar = res.data;
              localStorage.removeItem("currentUser");
              localStorage.clear();
              localStorage.setItem(
                "currentUser",
                JSON.stringify(this.httpService.USERINFO)
              );
              if(this.httpService.USERINFO.user_type==1){
              this._router.navigate(["/company/company"]);
            }
          else{
            this._router.navigate(["/predictions/predictions"], {
              queryParams: { campaign_id: this.campaign_id ,event_id:this.event_id },
            });
          }}
          }
         
        },
        (error: any) => {}
      );
  }
  savePassword(){
    if(this.new_password!=this.confirm_password){
      this._toastrService.error("New password and Retype new password should be same", "Failed", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      return;
    }
    this.loading = true;
    let request;

    request = {
      params: { old_password: this.old_password,new_password:this.new_password,confirm_password :this.confirm_password},
      action_url: "update_user_password",
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
            this.old_password='';
            this.new_password='';
            this.confirm_password='';
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

}
