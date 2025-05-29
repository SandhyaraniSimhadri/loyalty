import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "environments/environment";
import { User, Role } from "app/auth/models";
import { ToastrService } from "ngx-toastr";
import { CoreHttpService } from "@core/services/http.service";
import { Router } from "@angular/router";
import { SocialAuthService } from "@abacritt/angularx-social-login";


@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;
  public role_data: any;
  public role:any;
  private readonly sessionDuration: number = 15 * 60 * 1000;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService,
    private _router: Router,
    private socialAuthService: SocialAuthService,

    public httpService: CoreHttpService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Admin
    );
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Client
    );
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}api/verify_user`, { email, password })
      .pipe(
        map((user) => {
          const loginData = user?.data;
          // login successful if there's a jwt token in the response
          if (loginData && loginData.token) {
            if (user.data.user_type == 1) {
              this.role= "Super Admin";
              user.data.role = "Super Admin";
              // this.currentUser.role=user.data.role ;
            } else {
              this.role= "User";

              user.data.role = "User";
            }

            localStorage.setItem("currentUser", JSON.stringify(user.data));
            let user_data = JSON.parse(localStorage.getItem("currentUser"));
            this.httpService.USERINFO = user_data;
            this.httpService.APIToken = user_data.token;
            this.httpService.loginuserid = user_data.user_id;
            this.currentUserSubject.next(user.data);
          }
          this.setLoginTime();
          return user;
        })
      );
  }
  setLoginTime() {
    const loginTime = new Date().getTime();
    localStorage.setItem('loginTime', loginTime.toString());
  }
  isSessionExpired(): boolean {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - parseInt(loginTime);
      return timeElapsed >= this.sessionDuration;
    }
    return false; // If there's no login time, consider the session expired
  }
  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    localStorage.removeItem('loginTime');
    localStorage.clear();
    this.socialAuthService.signOut();
    // notify
    this.currentUser = null;
    this.currentUserSubject.next(null);
    this.currentUserSubject = null;
    this.clearAllCookies();
    setTimeout(() => {
      window.location.href="/";
  }, 500);
  this._toastrService.success("Thank you", "Success", {
    toastClass: "toast ngx-toastr",
    closeButton: true,
  });

  }
   clearAllCookies() {
    document.cookie.split(";").forEach(cookie => {
        const cookieParts = cookie.split("=");
        const cookieName = cookieParts[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
}
checkSessionOnPageLoad() {
  if (this.isSessionExpired()) {
    this.logout();
  }
}
}
