import {
  Component,
  NgZone,
  OnInit,
  ViewEncapsulation,
  Renderer2,
  ElementRef,
  AfterViewInit,
  HostListener,
  ViewChild
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { takeUntil, first } from "rxjs/operators";
import { Subject } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from "app/auth/service";
import { CoreConfigService } from "@core/services/config.service";
import { CoreHttpService } from "@core/services/http.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup } from "@angular/forms";
// import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";
// import {
//   SocialAuthService,
//   GoogleLoginProvider,
//   SocialUser,
//   FacebookLoginProvider,
// } from "@abacritt/angularx-social-login";
import { environment } from "environments/environment";
// import { ReCaptchaVService } from 'ng-recaptcha';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  

  // socialUser!: SocialUser;
  isLoggedin?: boolean;
  public coreConfig: any;
  loginForm: FormGroup;
  public login_cred = true;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public login_screen_image:any=true;
  public error = "";
  public passwordTextType: boolean;
  public role_data: any;
  public main_loading: any = false;
  public image_loading: any = false;

  public socialLogClicked: any = false;
  public type: any = 0;
  public campaign_id: any = null;
  token: string | undefined;
  // captcha_token: any = null;
  passwordNotSame:any=false;
  public register_clicked:any=false;
  public org: string;
  public loginImage: string;
  public logoIcon: string;
  public campaign_data:any;
  public api_url: any;
  public company_id:any;
  // Private
  private _unsubscribeAll: Subject<any>;
  showLoginForm: boolean = false;
  screenSize: string = 'large'; // Default to large
  @ViewChild('modalVC') modalVC: any;
  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  //6LfhKxUqAAAAADTIEBB4IRPhETpFycTuWF0Svb-6
  //6LfhKxUqAAAAABeZappTk6Uv0ydQ9hRgDuJvl9tI
  constructor(private modalService: NgbModal,
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,
    // private recaptchaV2Service: ReCaptchaV2Service,
    private formBuilder: FormBuilder,
    // private socialAuthService: SocialAuthService,
    private _zone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.token = undefined;
    // // redirect to home if already logged in
    // if (this._authenticationService.currentUserValue) {
    //   this._router.navigate(["/"]);
    // }
    this.detectScreenSize();
    this._unsubscribeAll = new Subject();
    this.api_url = environment.apiUrl;

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
    console.log("campaign id val", this.campaign_id);
    console.log("type", this.type);

    this._route.queryParams.subscribe((params) => {
      if (params) {
        this.campaign_id = params["campaign_id"];
      }
    });
    this.error = "";
    this.submitted = true;

    // stop here if form is invalid
    console.log("this.loginForm.invalid", this.loginForm.value);
    console.log("this.loginForm.invalid", this.loginForm.invalid);

   
    // if(this.loginForm.password)
    // console.log("value",this.loginForm.value);
    if (
      (this.type == 1 || this.type == 2) &&
      this.loginForm.value.confirm_password != this.loginForm.value.password
    ) {
      this.passwordNotSame=true;
      this._toastrService.error(
        "Password and Confirm password should be same",
        "Failed",
        { toastClass: "toast ngx-toastr", closeButton: true }
      );
      return;
    }
    if (this.loginForm.invalid) {
      return;
    }
    // Login
    this.loading = true;
    var user_val = this.loginForm.value;
    console.log("valuess", user_val);
    // return;
    let email = user_val.email;
    let pwd = user_val.password;
    if (this.type == undefined || this.type == 0) {
      console.log("login type", this.type);
      // if (this.captcha_token != null) {
        this._authenticationService
          .login(email, pwd)
          .pipe(first())
          .subscribe(
            (data) => {
              const user = data;
              if (data.status) {
                this.login_cred = true;
                localStorage.setItem("currentUser", JSON.stringify(user.data));
                let user_data = JSON.parse(localStorage.getItem("currentUser"));
                this.httpService.USERINFO = user_data;
                this.httpService.APIToken = user_data.token;
                this.httpService.loginuserid = user_data.user_id;

                // setTimeout(() => {
                console.log(
                  "first time login",
                  this.httpService.USERINFO.first_time_login
                );
                if (this.httpService.USERINFO.user_type == 1) {
                  if (this.httpService.USERINFO.first_time_login == 1) {
                   
                    if(this.campaign_id){
                      this._router.navigate(["/welcome"], {
                        queryParams: { campaign_id: this.campaign_id,welcome_image:this.campaign_data?.welcome_image,welcome_text:this.campaign_data?.welcome_text, event_id:this.campaign_data?.event_id},
                      });}
                      else{
                        this._router.navigate(["/welcome"], {
                          queryParams: {  campaign_id: this.campaign_id,
                            company_id: this.company_id},
                        });
                      }
                  } else {
                    this._router.navigate(["/company/company"]);
                  }
                } else {
                  if(this.campaign_id){
                    this._router.navigate(["/welcome"], {
                      queryParams: { campaign_id: this.campaign_id,welcome_image:this.campaign_data?.welcome_image,welcome_text:this.campaign_data?.welcome_text, event_id:this.campaign_data?.event_id },
                    });}
                    else{
                      // this._router.navigate(["/welcome"], {
                      //   queryParams: {  campaign_id: this.campaign_id,
                      //     company_id: this.company_id},
                      // });

                       this._router.navigate(["/welcome"]);
                    }
                }
                // }, 3000);
              } else {
                this.login_cred = false;
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
      // } else {
      //   this._toastrService.error("Please verify captcha", "Failed", {
      //     toastClass: "toast ngx-toastr",
      //     closeButton: true,
      //   });
      //   this.loading = false;
      // }
    } else if (this.type == 2) {
      user_val.campaign_id = this.campaign_id;
      console.log("set registration");
      this.setRegistration(user_val);
    } else {
      this.setNewPassword(user_val);
    }
  }


  ngOnInit(): void {
    // setTimeout(() => {
    //   if (this.modalVC) {
    //     this.modalService.open(this.modalVC, { centered: true });
    //   }
    // }, 100);
    // const path = window.location.pathname; 
    // this.org = path.split('/')[1]; 
    // if (this.org === 'org1') {
    //   this.loginImage = '../../../../../assets/images/login/org1/login.jpg';
    //   this.logoIcon = '../../../../../assets/images/login/org1/logo_icon.png';
    // } else if (this.org === 'org2') {
    //   this.loginImage = '../../../../../assets/images/login/org2/login.jpg';
    //   this.logoIcon = '../../../../../assets/images/login/org2/logo_icon.png';
    // } else {
    //   // Default case
    //   
    // }
  
    this.loginImage = '../../../../../assets/images/login/login.jpg';
      this.logoIcon = '../../../../../assets/images/login/logo_icon.png';
    this.loginForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      // username: ["", Validators.required],
    });
    this._route.queryParams.subscribe((params) => {
      if (params) {
        const type = params["type"];
        this.type = type;
        if (this.type == 1) {
          var email = params["email"];
          var userName = params["user_name"];
          this.company_id = params["company_id"];
        } else {
          this.campaign_id = params["campaign_id"];
          this.get_campaign_details();
        }

        console.log("Query Params:", { type, email, userName });

        if (email) {
          this.loginForm.patchValue({ email: email.trim() });
        }
      this.loginModify();

      }
    });
    console.log("type", this.type);

   
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });


    // this.socialAuthService.authState.subscribe((user) => {
    //   this.socialUser = user;
    //   console.log("@log user: ", user);
    //   // this.isLoggedin = user != null;
    //   console.log("logged user", this.socialUser);
    //   if (!!this.socialUser) {
    //     console.log("@log authstate user: ", user);
    //     this.checkUser();
    //   }
    // });
    // }
  }
  get_campaign_details(){
    this.image_loading=false;
    let request;

    request = {
      params: {id:this.campaign_id},
      action_url: "get_single_campaign",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.campaign_data=res.data[0];
          }
        }
        this.image_loading=true;
      },
      (error: any) => {
        this.image_loading=true;
      }
    );
  }
  loginModify() {
    if (this.type == 1 || this.type == 2) {
      this.register_clicked=true;
      this.loginForm.addControl(
        "confirm_password",
        new FormControl("", Validators.required)
      );
    }
    if (this.type == 2) {
      this.loginForm.addControl(
        "user_name",
        new FormControl("", Validators.required)
      );
    }
  if(this.register_clicked==true){
    this.loginForm.addControl(
      "confirm_password",
      new FormControl("", Validators.required)
    );
    this.loginForm.addControl(
      "user_name",
      new FormControl("", Validators.required)
    );
    this.type=2;
  }
    
  }

  // checkUser() {
  //   // window.location.reload();

  //   console.log("@log called checkUser");
  //   this.main_loading = true;
  //   let request = {
  //     params: { email: this.socialUser.email, name: this.socialUser.name },
  //     action_url: "check_user",
  //     method: "POST",
  //   };
  //   this.httpService.doHttp(request).subscribe(
  //     (res: any) => {
  //       if (res == "nonet") {
  //       } else {
  //         if (res.status == false) {
  //           this._toastrService.error(res.msg, "Failed", {
  //             toastClass: "toast ngx-toastr",
  //             closeButton: true,
  //           });
  //         } else if (res.status == true) {
  //           console.log("@log res status true");
  //           if (res.user_status == "existed") {
  //             if (res.data.user_type == 1) {
  //               res.data.role = "Super Admin";
  //             } else {
  //               res.data.role = "User";
  //             }

  //             localStorage.setItem("currentUser", JSON.stringify(res.data));
  //             // let user_data = JSON.parse(localStorage.getItem("currentUser"));
  //             this.httpService.USERINFO = res?.data;
  //             this.httpService.APIToken = res?.data?.token;
  //             this.httpService.loginuserid = res?.data?.user_id;
  //             if (res.data.user_type == 1) {
  //               if (res.data.first_time_login == 1) {
  //                 if(this.campaign_id){
  //                   this._router.navigate(["/welcome"], {
  //                     queryParams: { campaign_id: this.campaign_id,welcome_image:this.campaign_data?.welcome_image ,welcome_text:this.campaign_data?.welcome_text,
  //                       event_id:this.campaign_data?.event_id
  //                     },
  //                   });}
  //                   else{
  //                     this._router.navigate(["/welcome"], {
  //                       queryParams: {  campaign_id: this.campaign_id,
  //                         company_id: this.company_id},
  //                     });
  //                   }
  //               } else {
  //                 this._router.navigate(["/company/company"]);
  //               }
  //             } else {
  //               if (res.data.first_time_login == 1) {
  //                 if(this.campaign_id){
  //                   this._router.navigate(["/welcome"], {
  //                     queryParams: { campaign_id: this.campaign_id,welcome_image:this.campaign_data?.welcome_image,welcome_text:this.campaign_data?.welcome_text, event_id:this.campaign_data?.event_id},
  //                   });}
  //                   else{
  //                     this._router.navigate(["/welcome"], {
  //                       queryParams: {  campaign_id: this.campaign_id,
  //                         company_id: this.company_id},
  //                     });
  //                   }
  //               } else {
  //                 // this._router.navigate(["/predictions/predictions"], {
  //                 //   queryParams: { campaign_id: this.campaign_id },
  //                 // });
  //                 if(this.campaign_id){
  //                 this._router.navigate(["/welcome"], {
  //                   queryParams: { campaign_id: this.campaign_id,welcome_image:this.campaign_data?.welcome_image,welcome_text:this.campaign_data?.welcome_text, event_id:this.campaign_data?.event_id },
  //                 });}
  //                 else{
  //                   this._router.navigate(["/welcome"], {
  //                     queryParams: {  campaign_id: this.campaign_id,
  //                       company_id: this.company_id},
  //                   });
  //                 }
  //               }
  //             }
  //             this.main_loading = false;

  //           } else {
  //             this._toastrService.success(
  //               res.msg + " , Please login",
  //               "Success",
  //               {
  //                 toastClass: "toast ngx-toastr",
  //                 closeButton: true,
  //               }
  //             );
  //             this.loginForm = this._formBuilder.group({
  //               email: [
  //                 this.socialUser.email,
  //                 [Validators.required, Validators.email],
  //               ],
  //               password: ["123456", Validators.required],
  //               // username: ["", Validators.required],
  //             });
  //           }
  //           // this.modalService.dismissAll();
  //           // this.getEvents();
  //         }
  //       }
  //       // this.main_loading = false;
  //     },
  //     (error: any) => {
  //       this.main_loading = false;
  //     }
      
  //   );
  // }

  // loginWithFacebook(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }
  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }
  // loginWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }
  // logOut(): void {
  //   this.socialAuthService.signOut();
  // }
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
  setNewPassword(values: any) {
    this.loading = true;
    let request = {
      params: {
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        company_id:this.company_id,

      },
      action_url: "set_password",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
            this.login_cred=false;
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this.login_cred=true;
            this._toastrService.success(res.msg, "Success", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this._router.navigate(["/"]);
            this.type = 0;
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
  setRegistration(values: any) {
    console.log("vieww",this.login_screen_image);
    // return; 

    this.loading = true;
    let request = {
      params: {
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        user_name: values.user_name,
        campaign_id: this.campaign_id,
      },
      action_url: "set_registration",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        console.log("status",res);
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
            // setTimeout(() => {
            //   window.location.reload();
            // }, 500);
            this.type = 0;
            this.register_clicked=false;
            // this._router.navigate(["/"], {
            //   queryParams: { campaign_id: this.campaign_id },
            // });
            console.log("campaign id", this.campaign_id);
            
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
    if(this.screenSize=='small'){
    this.login_screen_image=false;}
    console.log("login screen",this.login_screen_image);
  }
  // onCaptchaResolved(response: any): void {
  //   // Use the response token as needed
  //   console.log("reCAPTCHA v2 Response:", response);
  //   this.captcha_token = response;
  // }
  public send(): void {
    console.debug(`Token [${this.token}] generated`);
  }
  // resolved(captchaResponse: string) {
  //   console.log(`Resolved captcha with response: ${captchaResponse}`);
  // }
  loginBtn() {
    this.register_clicked=false;
    if (this.type == 1 || this.type == 2) {
      this.loginForm.removeControl("confirm_password");
    }

    if (this.type == 2) {
      this.loginForm.removeControl("user_name");
    }
    if ((this.type != 1 && this.type != 2)) {
      this.loginForm.removeControl("confirm_password");
      this.loginForm.removeControl("user_name");
    }
    console.log("type val",this.type);
    this.type = 0;

    console.log("typr", this.type);
  }
  registerBtn() {
    this.register_clicked=true;
    this.loginModify();
  }
  @HostListener('window:resize', ['$event'])
  detectScreenSize() {
    this.screenSize = window.innerWidth < 992 ? 'small' : 'large';
  }

  goToNext() {
    console.log("trueeee",this.showLoginForm);
    if (this.screenSize === 'small') {
      this.showLoginForm = true; // Hide the image section on small screens
    }
  }
}
