import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { CoreHttpService } from '@core/services/http.service';

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
  timer = 895; // 14:55 in seconds
  timerDisplay: string = '';
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
  constructor(private _coreConfigService: CoreConfigService,     public httpService: CoreHttpService,
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
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    let request;

    request = {
      params: {email:this.forgotPasswordForm.value},
      action_url: "forgot_password_mail",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
          
          }
        }
        // this.image_loading=true;
      },
      (error: any) => {
        // this.image_loading=true;
      }
    );
    // stop here if form is invalid
  
  }
  
  onSubmitSet() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('New Password:', this.newPassword);
    // TODO: Call API to update the password
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
    this.updateTimer();
    setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.updateTimer();
      }
    }, 1000);
  }
  updateTimer() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timerDisplay = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
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
    // Add your verification logic here
  }

  resendCode() {
    console.log('Resending code...');
    this.timer = 895; // Reset timer
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
