import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
//import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';
// import {LoadingController, NavController} from '@ionic/angular';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { environment } from 'environments/environment';


@Injectable({
    providedIn: 'root',

})
export class CoreHttpService {
    private APIUrl: string = environment.apiUrl;
    // public uploadHostUrl: string = environment.uploadHostUrl;
    // public profileBaseUrl: string = environment.profileBaseUrl;
    public APIToken: string = '';

    public loginuserid;
    public USERINFO: any = {};
    public role_info:any;
  


    private appVersion = '';

    //forum related data

    public forumChannels: any = [];
    public selectedForum: any = {};
    public forumNotificationCount: any = 0;

    constructor(private http: HttpClient,
                //private transfer: FileTransfer,
               ) {
        if (localStorage.getItem('currentUser')) {
            let user = JSON.parse(localStorage.getItem('currentUser'));
            this.USERINFO = user;
            this.APIToken = user.token;
            this.loginuserid = user.user_id;
        }
    }


    /**
     * call api calls
     * @param request
     * @returns {Observable<R>}
     */




    public doHttp(request) {
        console.log("hiii");

        if (localStorage.getItem('currentUser')) {
            let user = JSON.parse(localStorage.getItem('currentUser'));
            this.USERINFO = user;
            this.APIToken = user.token;
            this.loginuserid = user.user_id;
        }
        console.log("api tocket",this.APIToken);

        let headers;

        let api_url = this.APIUrl;
        api_url = api_url + 'api/';

        let method = (request.method).toLowerCase();
        if (this.APIToken != '') {
            headers = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Access-Control-Allow-Origin', '*')
                .set('cache-control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
                .set('pragma', 'no-cache')
                .set("Authorization", `Bearer ${this.APIToken}`)
                .set('token', this.APIToken);
                console.log("headers",headers);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/json')
                .set('pragma', 'no-cache')
                .set('Access-Control-Allow-Origin', '*')
                .set('cache-control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')

        }

        if (!this.checkInternet()) {

            const simpleObservable = new Observable((observer) => {
                // observable execution
                observer.next('nonet');
                observer.complete();
            });
            return simpleObservable;
            //this.shared.toastMsgShow("No network connection.",2000)
        } else if (method === 'get' || method==='GET') {
            let params = '';
            return this.http.get(api_url + request.action_url + params, {
                headers: headers
            });
        } else if (method === 'post' || method==="POST") {
            console.log("request",headers);
            let params = request.params;
            if (request.params != null) params = request.params;
            return this.http.post(api_url + request.action_url, params, {
                headers: headers
            });
        } else if (method === 'put') {
            let params = request.params;
            if (request.params != null) params = request.params;
            return this.http.put(api_url + request.action_url, params, {
                headers: headers
            });
        } else if (method === 'delete') {
            // let params = request.params;
            // if (request.params != null) params = request.params;
            return this.http.delete(api_url + request.action_url, {
                headers: headers
            });
        }
      }

   



    checkInternet() {
        return navigator.onLine;
    }

   

   

    setLocalUser(data) {
        if (data) {
            localStorage.setItem('user', data);
        }
        else {
            localStorage.setItem('user', '');
        }
    }

    removeLocalUser() {
        localStorage.removeItem('user');
        localStorage.removeItem('parent');
    }

 

    navToLogin() {

        const request = {
            method: 'GET',
            action_url: 'logout'
        };
        this.doHttp(request).subscribe(
            res => {

            },
            error => {

            });
        this.removeLocalUser();
        this.APIToken = '';
        this.USERINFO = false;
        // this.navCtrl.navigateRoot('auth/login');
    }


}
