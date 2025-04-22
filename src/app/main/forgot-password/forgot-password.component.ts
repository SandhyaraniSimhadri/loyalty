import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { CoreHttpService } from '@core/services/http.service';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: UntypedFormGroup;
  public submitted = false;
  public main_loading: any = false;
  public loginImage: string;
  public logoIcon: string;
  // Private
  otp: string[] = ['', '', '', ''];
  timer = 45; // 14:55 in seconds
  timerDisplay: string = '';
  resendEnabled: boolean = false;
  private _unsubscribeAll: Subject<any>;
  public screen:any='reset';
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  private intervalId: any; // For clearing setInterval
  constructor(private _coreConfigService: CoreConfigService, 
    private _toastrService: ToastrService,    private _router: Router,
    
        public httpService: CoreHttpService,
  private _formBuilder: UntypedFormBuilder) {
    this._unsubscribeAll = new Subject();
    this.loginImage = '../../../../../assets/images/login/login.jpg';
    this.logoIcon = '../../../../../assets/images/login/logo_icon.png';
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.main_loading = true;
    this.submitted = true;
  
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  
    const request = {
      params: this.forgotPasswordForm.value,
      action_url: "forgot_password_mail",
      method: "POST",
    };
  
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        this.main_loading = false;
        if (res == "nonet") {
          // handle no network
        } else {
          if (res.status == false) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else if (res.status == true) {
            this.screen="otp";
            this._toastrService.success("We've sent an OTP to your email address.", "OTP sent", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.startTimer();

          }
        }
      },
      (error: any) => {
        this.main_loading = false;
      }
    );
  }
  
  
  onSubmitSet() {
    this.main_loading=true;
    if (this.newPassword !== this.confirmPassword) {
      this._toastrService.error("Passwords did not match", "Failed", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      this.main_loading=false;
      return;
    }

    console.log('New Password:', this.newPassword);
    const request = {
      params: {password:this.newPassword,
        email:this.forgotPasswordForm.value.email
      },
      action_url: "reset_password",
      method: "POST",
    };
  
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        this.main_loading = false;
        if (res == "nonet") {
          // handle no network
        } else {
          if (res.status == false) {
            // handle failure
          } else if (res.status == true) {
            if(res.msg=='Password resetted'){
              this._toastrService.success('Password updated successfully, please login', "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
              this._router.navigate(["/login"]);
            }else{
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            }
          }
          else{
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        }
      },
      (error: any) => {
        this.main_loading = false;
      }
    );
    
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  
  }
  updateTimer() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timerDisplay = `${this.pad(minutes)}:${this.pad(seconds)}`;
  
    if (this.timer === 0) {
      this.resendEnabled = true; // Enable resend
    } else {
      this.resendEnabled = false;
    }
  }
  

  

  autoFocus(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const next = input.nextElementSibling as HTMLInputElement;

    if (input.value.length === 1 && next) {
      next.focus();
    }
  }

  verifyCode() {
    const code = this.otp.join('');
    console.log('Entered OTP:', code);
    const request = {
      params: {otp:code,
        email:this.forgotPasswordForm.value.email
      },
      action_url: "verify_otp",
      method: "POST",
    };
  
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        this.main_loading = false;
        if (res == "nonet") {
          // handle no network
        } else {
          if (res.status == false) {
            // handle failure
          } else if (res.status == true) {
            if(res.msg=='OTP verified'){
              this.screen='reset_password';
              this._toastrService.success('OTP verified successfully', "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            }else{
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            }
          }
          else{
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        }
      },
      (error: any) => {
        this.main_loading = false;
      }
    );
  }



  startTimer() {
    this.timer = 45; // Reset timer to 45 seconds
    this.resendEnabled = false;
    this.updateTimerDisplay();

    // Clear previous interval if any
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.updateTimerDisplay();
      } else {
        this.resendEnabled = true;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timerDisplay = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  resendCode() {
    if (this.resendEnabled) {
      this.onSubmit();
      this.startTimer(); // Restart the timer
      // Call API to resend OTP here if needed
    }
  }



  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    
  }
}
