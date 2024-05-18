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
  selector: "app-campaigns-new",
  templateUrl: "./campaigns-new.component.html",
  styleUrls: ["./campaigns-new.component.scss"],
  encapsulation: ViewEncapsulation.None,
 
})
export class CampaignsNewComponent implements OnInit {
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
  public company_id:any;
  public errorMsg:any=false;
  // public games:any=[];
  // public game:any={'name':'','team_a':'','team_b':''};
  public basicTP = { hour: 13, minute: 30 };
  public end_time = { hour: 13, minute: 30 };
  public games = [{ id: '', name: '', team_a: '', team_b: '', points:'',game_start_date:'',game_start_time:'',game_end_date:'',game_end_time:''  ,team_a_image: null, 
  team_b_image: null  }];

  public game = {
    name: '',
    team_a: '',
    team_b: '',
    points:'',
    game_start_date:'',game_start_time:'', game_end_date:'',game_end_time:'', team_a_image: null, 
    team_b_image: null  
  };
  public companyData: any;


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
    private http: HttpClient,
    private _router: Router,
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
    this.getEvents();

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
      points:'',
      game_start_date:'',game_start_time:'', game_end_date:'',game_end_time:'',  team_a_image: null, 
      team_b_image: null 
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
    if(this.event_id==1){
    const hasEmptyFields = this.games.some(game => !game.name || !game.team_a || !game.team_b || !game.points || !game.game_start_date || !game.game_start_time || !game.game_end_date || !game.game_end_time || !game.team_a_image || !game.team_b_image);
    if (hasEmptyFields) {
      this.errorMsg=true;
      return;
    }
  }
    this.errorMsg=false;
    // If no empty fields, proceed with form submission
    // this.loading = true;
    console.log("basicTP",this.basicTP);
    this.loading = true;
    const formData = new FormData();
    const games_data = this.games;
    console.log("gamesssss",games_data);
    // const game_start_timeString = `${this.start_time.hour}:${this.start_time.minute}`;
    const endTimeString = `${this.end_time.hour}:${this.end_time.minute}`;
    formData.append("campaign_title", this.campaign_title);
    formData.append("start_date", this.start_date);
    formData.append("end_date", this.end_date);
    // formData.append("start_time", game_start_timeString);
    formData.append("end_time",endTimeString);
    formData.append("event_id", this.event_id);
    formData.append("company_id", this.company_id);
    const gamesDataWithoutFiles = this.games.map(game => {
      const { team_b_image,team_a_image, ...rest } = game;
      return rest;
    });
  
    formData.append('games', JSON.stringify(gamesDataWithoutFiles));
  
    // Append each image file to the FormData object
    this.games.forEach((game, index) => {
      if (game.team_b_image) {
        formData.append(`team_b_image_${index}`, game.team_b_image);
      }
      // Similarly, append team_a_image if you have it
      if (game.team_a_image) {
        formData.append(`team_a_image_${index}`, game.team_a_image);
      }
    });
  

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
              this._router.navigate(["/campaigns/campaigns"]);
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
  getEvents() {
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
    this.getEvents();
    this.getData();
    this.apiUrl = environment.apiUrl;
   
  }
 
  uploadImage(event: any) {
    this.loading = true;
    this.image = event.target.files[0];
    this.loading = false;
  }
  getData() {
    let request = {
      params: null,
      action_url: "get_companies",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.companyData = res.data;
          }
        }
      },
      (error: any) => {}
    );
  }
  validateDates() {
    if (this.start_date >= this.end_date) {
      // If start date is greater than or equal to end date, reset both dates and form
      this.start_date = null;
      this.end_date = null;
      this._toastrService.error("Start date must be less than end date. Both dates have been reset.", "Error", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
     
    }
  }
  validateInputs(gameIndex: number) {
    const game = this.games[gameIndex];
    if (!game.name || !game.team_a || !game.team_b || !game.points || !game.game_start_date || !game.game_start_time || !game.game_end_date || !game.game_end_time || !game.team_a_image || !game.team_b_image) {
      return false;
    }
    return true;
  }
  uploadTeamAImage(i:any,event: any) {
    // this.loading=true;
    // if (event.target.files && event.target.files[0]) {
    //   let reader = new FileReader();
    //   reader.onload = (event: any) => {
    //     // this.avatarImage = event.target.result;
    //   };

    //   reader.readAsDataURL(event.target.files[0]);
    //   // this.currentRow.avatar = event.target.files[0].name;
    //   this.games[i].team_a_image = event.target.files[0];
    // }
    // this.loading=false;
    // // this.checkFormModified();


    this.loading=true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        // this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      // this.currentRow.avatar = event.target.files[0].name;
      this.games[i].team_a_image = event.target.files[0];
      console.log("valueee will be",event.target.files[0]);
     console.log( "imgave valuree",this.games[i].team_a_image );

    }
    this.loading=false;
    // this.checkFormModified();




  }
   uploadTeamBImage(i:any,event: any) {
    this.loading=true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        // this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      // this.currentRow.avatar = event.target.files[0].name;
      this.games[i].team_b_image = event.target.files[0];
      console.log("image value",this.games[i].team_b_image)
      // return;
    }
    this.loading=false;
    // this.checkFormModified();

  }
}
