import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "environments/environment";
import { User, Role } from "app/auth/models";
import { ToastrService } from "ngx-toastr";
import { CoreHttpService } from "@core/services/http.service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;
  public role_data:any;

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
    public httpService: CoreHttpService,
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
    return (
      this._http
        .post<any>(`${environment.apiUrl}api/verify_user`, { email, password })
        .pipe(
          map((user) => {
            const loginData = user?.data;
            // login successful if there's a jwt token in the response
            if (loginData && loginData.token) {
             
              if(user.data.user_type==1){
                user.data.role='Super Admin';
              }else{
                user.data.role='Sub Admin';
              }
              
              localStorage.setItem("currentUser", JSON.stringify(user.data));
              let user_data = JSON.parse(localStorage.getItem('currentUser'));
              this.httpService.USERINFO = user_data;
              this.httpService.APIToken = user_data.token;
              this.httpService.loginuserid = user_data.user_id;
              this.currentUserSubject.next(user.data);
            }

            return user;
          })
        )
    );
  }


 

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    // notify
    this.currentUserSubject.next(null);
  }
}
