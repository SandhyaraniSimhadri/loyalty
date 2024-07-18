import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";
import { cloneDeep } from "lodash";
import { UserEditService } from "./user-edit.service";
import { CoreHttpService } from "@core/services/http.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { ModalsService } from "@core/services/modals.service";
import { isEqual } from "lodash";

@Component({
  selector: "app-campaigns-edit",
  templateUrl: "./campaigns-edit.component.html",
  styleUrls: ["./campaigns-edit.component.scss"],
})
export class CampaignsEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  public image: any;
  public apiUrl: any;
  public loading: boolean = false;
  public churchData: any;
  public buttonLoading: boolean = false;
  @ViewChild("accountForm") accountForm: NgForm;
  public membersData: any;
  public originalFormValues: any;
  public formModified: boolean = true;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };
  public duration: any = 0;
  public errorMsg: any = false;
  public durationMsg: any = false;
  public games = [
    {
      id: 0,
      name: "",
      team_a: "",
      team_b: "",
      points: "",
      game_start_date: "",
      game_start_time: "",
      game_end_date: "",
      game_end_time: "",
      team_a_image: null,
      team_b_image: null,
    },
  ];

  public questions = [
    {
      id: 0,
      question: "",
      response_a: "",
      response_b: "",
      response_c: "",
      response_d: "",
      correct_answer:"",
      points: "",
    },
  ];

  public companyData: any;

  public game = {
    name: "",
    team_a: "",
    team_b: "",
    points: "",
    game_start_date: "",
    game_start_time: "",
    game_end_date: "",
    game_end_time: "",
    team_a_image: null,
    team_b_image: null,
  };


  public question = {
    question: "",
    response_a: "",
    response_b: "",
    response_c: "",
    response_d: "",
    correct_answer:"",
    points: "",
  };
  public eventsData: any;

  public selectMultiLanguages = [
    "English",
    "Spanish",
    "French",
    "Russian",
    "German",
    "Arabic",
    "Sanskrit",
  ];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(
    private router: Router,
    private _userEditService: UserEditService,
    private http: HttpClient,
    public httpService: CoreHttpService,
    private _toastrService: ToastrService,
    private _router: Router,
    public modalsService: ModalsService
  ) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
    this.formModified = false;
  }
  checkEvent(event_id: any) {
    if (event_id == 1) {
      this.currentRow.games = this.games;
    }
    else if (event_id == 2) {
      this.currentRow.quizzes = this.questions;
    } else {
      this.currentRow.games = [
        {
          id: 0,
          name: "",
          team_a: "",
          team_b: "",
          points: "",
          game_start_date: "",
          game_start_time: "",
          game_end_date: "",
          game_end_time: "",
          team_a_image: null,
          team_b_image: null,
        },
      ];

      this.currentRow.questions = [
        {
          id: 0,
          question: "",
          response_a: "",
          response_b: "",
          response_c: "",
          response_d: "",
          correct_answer:"",
          points: "",
        },
      ];
    }
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.currentRow.avatar = event.target.files[0].name;
      this.image = event.target.files[0];
    }
    this.loading = false;
    this.checkFormModified();
  }

  /**
   * Submit
   *
   * @param form
   */
  addItem() {
    this.currentRow.games.push({
      id: 0,
      name: "",
      team_a: "",
      team_b: "",
      points: "",
      game_start_date: "",
      game_start_time: "",
      game_end_date: "",
      game_end_time: "",
      team_a_image: null,
      team_b_image: null,
    });
    this.checkFormModified();
  }
  deleteItem(id) {
    for (let i = 0; i < this.currentRow.games.length; i++) {
      if (this.games.indexOf(this.games[i]) === id) {
        this.games.splice(i, 1);
        break;
      }
    }
    this.checkFormModified();
  }

  addQuestion() {
    this.currentRow.quizzes.push({
      id: 0,
      question: "",
      response_a: "",
      response_b: "",
      response_c: "",
      response_d: "",
      correct_answer:"",
      points: "",
    });
    this.checkFormModified();
  }
  deleteQuestion(id) {
    for (let i = 0; i < this.currentRow.quizzes.length; i++) {
      if (this.questions.indexOf(this.questions[i]) === id) {
        this.questions.splice(i, 1);
        break;
      }
    }
    this.checkFormModified();
  }
  submit(form) {
    this.buttonLoading = true;
    if (form.valid) {
      if (this.currentRow.event_id == 1) {
        const hasEmptyFields = this.currentRow.games.some(
          (game) =>
            !game.name ||
            !game.team_a ||
            !game.team_b ||
            !game.points ||
            !game.game_start_date ||
            !game.game_start_time ||
            !game.game_end_date ||
            !game.game_end_time ||
            !game.team_a_image ||
            !game.team_b_image
        );
        if (hasEmptyFields) {
          this.errorMsg = true;
          return;
        }
      }
      if (this.currentRow.event_id == 2) {
        const hasEmptyFields = this.currentRow.quizzes.some(
          (question) =>
            !question.question ||
            !question.response_a ||
            !question.response_b ||
            !question.response_c ||
            !question.response_d ||
            !question.correct_answer || 
            !question.points
        );
        if (hasEmptyFields) {
          this.errorMsg = true;
          return;
        }
        if(this.currentRow.duration==0){
          this.durationMsg= true;
  
        }
      }
      this.errorMsg = false;
      this.durationMsg=false;
  
      const formData = new FormData();
      const games_data = this.games;
      formData.append("image", this.image);
      formData.append("id", this.currentRow.id);

      formData.append("campaign_title", this.currentRow.campaign_title);
      formData.append("start_date", this.currentRow.start_date);
      formData.append("end_date", this.currentRow.end_date);
      formData.append("event_id", this.currentRow.event_id);
      formData.append("company_id", this.currentRow.company_id);
      formData.append("duration", this.currentRow.duration);
      formData.append("calculatePoints", String(this.currentRow.calc_points_immediately));

      if(this.currentRow.event_id==1){
        const gamesDataWithoutFiles = this.currentRow.games.map((game) => {
          const { team_b_image, team_a_image, ...rest } = game;
          return rest;
        });
    
        formData.append("games", JSON.stringify(gamesDataWithoutFiles));
    
        // Append each image file to the FormData object
        this.games.forEach((game, index) => {
          if (game.team_b_image) {
            formData.append(`team_b_image_${index}`, game.team_b_image);
          }
          // Similarly, append team_a_image if you have it
          if (game.team_a_image) {
            formData.append(`team_a_image_${index}`, game.team_a_image);
          }
        });}
        if(this.currentRow.event_id==2){
          
          formData.append("questions",JSON.stringify(this.currentRow.quizzes));
          
    
        }

      this.currentRow.image = this.image;
      this.http
        .post<any>(this.apiUrl + "api/update_campaign", formData)
        .subscribe(
          (res: any) => {
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
                this._router.navigate(["/campaigns/campaigns"]);
              }
            }
            this.buttonLoading = false;
          },
          (error: any) => {
            this.buttonLoading = false;
          }
        );
    } else {
      this.buttonLoading = false;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.getEvents();
    this.getData();

    this.getSingleCampaign();
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
  getSingleCampaign() {
    this.loading = true;
    let request;

    request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_campaign",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            if(res.data[0].event_title=="PREDICTION EVENT"){
            this.games = res.data[0].games;}
            
            if(res.data[0].event_title=="QUIZ"){
              this.questions = res.data[0].quizzes;}
            this.currentRow = this.modalsService.replaceNullsWithEmptyStrings(
              res.data[0]
            );
            if(this.currentRow.calc_points_immediately=="false"){
              this.currentRow.calc_points_immediately=false;
            }
            this.originalFormValues = { ...this.currentRow };

            if (this.currentRow.avatar) {
              this.avatarImage = this.apiUrl + this.currentRow.avatar;
            }
            this.tempRow = cloneDeep(this.currentRow);
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  checkFormModified() {
    this.formModified = !isEqual(this.currentRow, this.originalFormValues);
    this.formModified = true;
  }
  uploadTeamAImage(i: any, event: any) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        // this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      // this.currentRow.avatar = event.target.files[0].name;
      this.games[i].team_a_image = event.target.files[0];
    }
    this.loading = false;
    // this.checkFormModified();
  }
  uploadTeamBImage(i: any, event: any) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        // this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      // this.currentRow.avatar = event.target.files[0].name;
      this.games[i].team_b_image = event.target.files[0];
    }
    this.loading = false;
    // this.checkFormModified();
  }
}
