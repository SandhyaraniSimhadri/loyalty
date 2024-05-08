import { Component, NgZone, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { takeUntil, first } from "rxjs/operators";
import { Subject } from "rxjs";

import { AuthenticationService } from "app/auth/service";
import { CoreConfigService } from "@core/services/config.service";
import { CoreHttpService } from "@core/services/http.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup } from "@angular/forms";
// import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
} from "@abacritt/angularx-social-login";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */

  socialUser!: SocialUser;
  isLoggedin?: boolean;
  public coreConfig: any;
  loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = "";
  public passwordTextType: boolean;
  public role_data: any;
  public main_loading: any = false;
  public socialLogClicked: any = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,

    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,
    private _zone: NgZone
  ) {
    // // redirect to home if already logged in
    // if (this._authenticationService.currentUserValue) {
    //   this._router.navigate(["/"]);
    // }

    this._unsubscribeAll = new Subject();

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

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.error = "";
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Login
    this.loading = true;
    let user_val = this.loginForm.value;
    let email = user_val.email;
    let pwd = user_val.password;
    this._authenticationService
      .login(email, pwd)
      .pipe(first())
      .subscribe(
        (data) => {
          const user = data;
          if (data.status) {
            localStorage.setItem("currentUser", JSON.stringify(user.data));
            let user_data = JSON.parse(localStorage.getItem("currentUser"));
            this.httpService.USERINFO = user_data;
            this.httpService.APIToken = user_data.token;
            this.httpService.loginuserid = user_data.user_id;

            setTimeout(() => {
              this._toastrService.success(
                "You have successfully logged in. Now you can start to explore. Enjoy! 🎉",
                "👋 Welcome !",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 4500);

            // setTimeout(() => {
              if ( this.httpService.USERINFO.user_type == 1) {
                console.log("company");
              this._router.navigate(["/company/company"]);}
              else{
                console.log("predictions");

                this._router.navigate(["/predictions/predictions"]);
              }
            // }, 3000);
          } else {
            setTimeout(() => {
              this._toastrService.error(data.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            }, 2500);
          }
          this.loading = false;
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );

    return;
  }
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      // username: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });

    // if( localStorage.getItem("currentUser")){
    //   this._router.navigate(["/company/company"]);
    // }
    // else{

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      console.log("@log user: ", user);
      // this.isLoggedin = user != null;
      console.log("logged user", this.socialUser);
      if (!!this.socialUser) {
        console.log("@log authstate user: ", user);
        this.checkUser();
      }
    });
    // }
  }

  checkUser() {
    // window.location.reload();

    console.log("@log called checkUser");
    this.main_loading = true;
    let request = {
      params: { email: this.socialUser.email, name: this.socialUser.name },
      action_url: "check_user",
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
            console.log("@log res status true");
            if (res.user_status == "existed") {
              if (res.data.user_type == 1) {
                res.data.role = "Super Admin";
              } else {
                res.data.role = "User";
              }
              
              localStorage.setItem("currentUser", JSON.stringify(res.data));
              // let user_data = JSON.parse(localStorage.getItem("currentUser"));
              this.httpService.USERINFO = res?.data;
              this.httpService.APIToken = res?.data?.token;
              this.httpService.loginuserid = res?.data?.user_id;
              if (res.data.user_type == 1) {
                console.log("company");
              this._router.navigate(["/company/company"]);}
              else{
                console.log("predictions");

                this._router.navigate(["/predictions/predictions"]);
              }
              this.main_loading = false;

              setTimeout(() => {
                this._toastrService.success(
                  "You have successfully logged in. Now you can start to explore. Enjoy! 🎉",
                  "👋 Welcome !",
                  { toastClass: "toast ngx-toastr", closeButton: true }
                );
              }, 3500);
            } else {
              this._toastrService.success(
                res.msg + " , Please login",
                "Success",
                {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                }
              );
              this.loginForm = this._formBuilder.group({
                email: [
                  this.socialUser.email,
                  [Validators.required, Validators.email],
                ],
                password: ["123456", Validators.required],
                // username: ["", Validators.required],
              });
            }
            // this.modalService.dismissAll();
            // this.getEvents();
          }
        }
        // this.main_loading = false;
      },
      (error: any) => {
        this.main_loading = false;
      }
    );
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  signOut(): void {
    this.socialAuthService.signOut();
  }
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  logOut(): void {
    this.socialAuthService.signOut();
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  notFound() {
    this._toastrService.info(
      "Registration is not yet started",
      "Not yet started",
      {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      }
    );
  }
  // loginWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then(() => console.log("true"));
  // }
}
