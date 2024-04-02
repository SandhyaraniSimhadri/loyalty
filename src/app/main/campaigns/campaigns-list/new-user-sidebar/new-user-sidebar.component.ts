import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

import { ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import * as snippet from 'app/main/forms/form-elements/date-time-picker/date-time-picker.snippetcode';

@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
})
export class NewUserSidebarComponent implements OnInit {
  @Output() onCampaignAdded: EventEmitter<any> = new EventEmitter<any>();

  public form: any;

  public loading: boolean = false;
  public image: any;
  public apiUrl: any;
  public imageval: any;
  public campaign_title: any;
  public start_date: any;
  public end_date: any;
  public event_id: any;
  public eventsData:any;
  // public games:any=[];
  // public game:any={'name':'','team_a':'','team_b':''};
  public basicTP = { hour: 13, minute: 30 };
  public end_time = { hour: 13, minute: 30 };
  public games = [{ id: '', name: '', team_a: '', team_b: '' }];

  public game = {
    name: '',
    team_a: '',
    team_b: ''
  };

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    public httpService: CoreHttpService,
    private router: Router,
    private _toastrService: ToastrService,
    private http: HttpClient
  ) {
    if(this.httpService.USERINFO.role=='Sub Admin'){
  }
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this.getData();
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  addItem() {
    this.games.push({
      id:'',
      name: '',
      team_a: '',
      team_b: '',
    });
  }
  deleteItem(id) {
    for (let i = 0; i < this.games.length; i++) {
      if (this.games.indexOf(this.games[i]) === id) {
        this.games.splice(i, 1);
        break;
      }
    }
  }

  submit(form) {
    console.log("basicTP",this.basicTP);
    this.loading = true;
    const formData = new FormData();
    const games_data = this.games;
    // const startTimeString = `${this.start_time.hour}:${this.start_time.minute}`;
    const endTimeString = `${this.end_time.hour}:${this.end_time.minute}`;
    formData.append("campaign_title", this.campaign_title);
    formData.append("start_date", this.start_date);
    formData.append("end_date", this.end_date);
    // formData.append("start_time", startTimeString);
    formData.append("end_time",endTimeString);
    formData.append("event_id", this.event_id);
    formData.append('games', JSON.stringify(games_data));

    if (form.valid) {

      this.http.post<any>(this.apiUrl + "api/add_campaign", formData).subscribe(
        (res: any) => {

          if (res == "nonet") {
          } else {
            if (res.status == false) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else if (res.status == true) {
              this.onCampaignAdded.emit(res.data);

              this._toastrService.success(res.msg, "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
              this.toggleSidebar("new-user-sidebar");
            }
          }
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
    this.loading=false;
  }
  getData() {
    let request = {
      params: null,
      action_url: "get_events",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.eventsData = res.data;
          }
        }
      },
      (error: any) => {}
    );
  }
  ngOnInit(): void {
    this.getData();
    this.apiUrl = environment.apiUrl;
   
  }
 
  uploadImage(event: any) {
    this.loading = true;
    this.image = event.target.files[0];
    this.loading = false;
  }

}
