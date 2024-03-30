import { Component, OnInit, ViewEncapsulation } from "@angular/core";
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
import { FormBuilder, FormGroup } from '@angular/forms';
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
  public coreConfig: any;
  loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = "";
  public passwordTextType: boolean;
  public role_data:any;
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
    private _toastrService: ToastrService
  ) {
    // redirect to home if already logged in
    if (this._authenticationService.currentUserValue) {
      this._router.navigate(["/company-management"]);
    }

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
            let user_data = JSON.parse(localStorage.getItem('currentUser'));
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
            this._router.navigate([this.returnUrl]);
          // }, 3000);
          } else {
            setTimeout(() => {
              this._toastrService.error(
                data.msg,
                "Failed",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 2500);
          }
          this.loading=false;
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
      email: [
        "",
        [Validators.required, Validators.email],
      ],
      password: ["123456", Validators.required],
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
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  notFound(){
    this._toastrService.info('Registration is not yet started', "Not yet started", {
      toastClass: "toast ngx-toastr",
      closeButton: true,
    });
  }
 
}
