import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { CoreHttpService } from '@core/services/http.service';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'app/auth/service/user.service';
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage: string;
  public user_info :any;
  public loading:any=false;
  public apiUrl: any;
  public image:any;
  public old_password:any;
  public new_password:any;
  public confirm_password:any;
  public twitter:any;
  public facebook:any;
  public google:any;
  public linkedin:any;
  public instagram:any;
  public quora:any;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
   
    constructor(  private userService: UserService, private _toastrService: ToastrService,private http: HttpClient,private _accountSettingsService: AccountSettingsService, private httpService:CoreHttpService,) {
    this._unsubscribeAll = new Subject();
    
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
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

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.image = event.target.files[0];
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.apiUrl = environment.apiUrl;
   
    this.user_info = this.httpService.USERINFO;
    console.log("user infooo",this.user_info);
    if (this.user_info.avatar) {
      this.avatarImage = this.apiUrl + this.user_info.avatar;
    }
    console.log("avatar image",this.avatarImage);
    console.log("user info",this.user_info);
    // content header
    this.contentHeader = {
      headerTitle: 'Account Settings',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Pages',
            isLink: true,
            link: '/'
          },
          {
            name: 'Account Settings',
            isLink: false
          }
        ]
      }
    };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  save() {
    var i = 0;
   
    this.loading = true;
  
      const formData = new FormData();
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
              } else if (res.status == true) {
                this._toastrService.success(res.msg, "Success", {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                });
                this.httpService.USERINFO.avatar = res.data;
                localStorage.removeItem("currentUser");
                localStorage.clear();
                localStorage.setItem(
                  "currentUser",
                  JSON.stringify(this.httpService.USERINFO)
                );
                this.userService.updateCurrentUser(this.httpService.USERINFO);
              }
            }
            this.loading = false;
          },
          (error: any) => {
          }
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
  saveSocialMediaAccounts(){
    this.loading = true;
    let request;

    request = {
      params: { twitter_url:this.user_info.twitter_url,facebook_url:this.user_info.facebook_url, google_url:this.user_info.google_url,linkedin_url:this.user_info.linkedin_url,instagram_url:this.user_info.instagram_url, quora_url:this.user_info.quora_url},
      action_url: "update_social_media_account",
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
            this.twitter='';
            this.facebook='';
            this.google='';
            this.linkedin='';
            this.instagram='';
            this.quora='';


          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }



}
