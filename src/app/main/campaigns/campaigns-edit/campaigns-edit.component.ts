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
  public image: any = "";
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
  public isInvalidTag = false;
  public duration: any = 0;
  public errorMsg: any = false;
  public durationMsg: any = false;
  public logo_image: any;
  public login_image: any;
  public welcome_image: any;
  public imageval: any;

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
      correct_answer: "",
      points: "",
      selectedFile: null as File | null ,
      file_name:"",
      isDragging : false,
      showUpload : false,
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
    correct_answer: "",
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
    } else if (event_id == 2) {
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
          correct_answer: "",
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
  uploadImage(event: any, type: any) {
    this.loading = true;
    var imageValue='';
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        // this.avatarImage = event.target.result;
        imageValue = event.target.result;

      };

      reader.readAsDataURL(event.target.files[0]);
      
    
    if (type == "welcome") {
      this.welcome_image = event.target.files[0];
    } else if (type == "logo") {
      this.logo_image = event.target.files[0];
    } else if (type == "campaign") {
      this.currentRow.avatar = event.target.files[0].name;
      this.image = event.target.files[0];
        this.avatarImage = event.target.result;

    } else {
      this.login_image = event.target.files[0];
    }
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
      correct_answer: "",
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
    if (!form.valid) return;
  
    // Validate based on event_id
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
      if (this.currentRow.duration == 0) {
        this.durationMsg = true;
        this._toastrService.error("Please fill all details", "Failed", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        return;
      }
    }
  
    this.errorMsg = false;
    this.durationMsg = false;
    this.buttonLoading = true;
  
    // Convert file to Base64
    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
  
    const processFiles = async () => {
      try {
        const processedGames = this.currentRow.event_id == 1 
          ? await Promise.all(this.currentRow.games.map(async (game) => ({
              ...game,
              team_a_image: game.team_a_image ? await convertFileToBase64(game.team_a_image) : null,
              team_b_image: game.team_b_image ? await convertFileToBase64(game.team_b_image) : null,
            })))
          : [];
  
        const processedQuestions = this.currentRow.event_id == 2
          ? await Promise.all(this.currentRow.quizzes.map(async (question) => ({
              ...question,
              selectedFile: question.selectedFile ? await convertFileToBase64(question.selectedFile) : null,
            })))
          : [];
  
        const payload = {
          id: this.currentRow.id,
          campaign_title: this.currentRow.campaign_title,
          campaign_tag:this.currentRow.campaign_tag,
          start_date: this.currentRow.start_date,
          end_date: this.currentRow.end_date,
          event_id: this.currentRow.event_id,
          company_id: this.currentRow.company_id,
          title: this.currentRow.title,
          login_text:this.currentRow.login_text,
          terms_and_conditions: this.currentRow.terms_and_conditions,
          game_type: this.currentRow.game_type,
          description: this.currentRow.description,
          duration: this.currentRow.duration,
          calculatePoints: String(this.currentRow.calc_points_immediately),
          logo_image: this.logo_image ? await convertFileToBase64(this.logo_image) : null,
          login_image: this.login_image ? await convertFileToBase64(this.login_image) : null,
          welcome_image: this.welcome_image ? await convertFileToBase64(this.welcome_image) : null,
          campaign_image: this.image ? await convertFileToBase64(this.image) : null,
          games: this.currentRow.event_id == 1 ? processedGames : [],
          questions: this.currentRow.event_id == 2 ? processedQuestions : [],
        };
  
        this.http.post<any>(this.apiUrl + "api/update_campaign", payload).subscribe(
          (res: any) => {
            this.buttonLoading = false;
            if (!res.status) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else {
             
              if(res.tag=='Duplicate'){
                this._toastrService.error(res.msg, "Failed", {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                });
              }
              else{
                this._toastrService.success(res.msg, "Success", {
                  toastClass: "toast ngx-toastr",
                  closeButton: true,
                });
                this._router.navigate(["/campaigns/campaigns"]);
              }
            
            }
          },
          (error: any) => {
            this.buttonLoading = false;
            this._toastrService.error("An error occurred", "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        );
      } catch (error) {
        this.buttonLoading = false;
        console.error("Error processing files:", error);
        this._toastrService.error("File processing failed", "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    };
  
    processFiles();
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
            if (res.data[0].event_title == "PREDICTION EVENT") {
              this.games = res.data[0].games;
            }

            if (res.data[0].event_title == "QUIZ") {
              this.questions = res.data[0].quizzes;
            }
            this.currentRow = this.modalsService.replaceNullsWithEmptyStrings(
              res.data[0]
            );
            if (this.currentRow.calc_points_immediately == "false") {
              this.currentRow.calc_points_immediately = false;
            }
            console.log("data before map",this.currentRow.quizzes);

            this.currentRow.quizzes = this.currentRow.quizzes.map(item => ({
              ...item,
              updated: false
            }));
            console.log("data after map",this.currentRow.quizzes);
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
  onFileSelected(event: any,question) {
    const file = event.target.files[0];
    if (file) {
      
        const reader = new FileReader();
        
        reader.onload = () => {
          question.preview = reader.result; 
        };
    
        reader.readAsDataURL(file);
      
      question.selectedFile = file;
      question.updated=true;
      console.log('File selected:', question.selectedFile);
      question.file_name=question.selectedFile.name;
    }
  }
  toggleUpload(question) {
    question.file_name = !question.file_name;
  }
  
onTagChange() {
  this.validateTag();
  this.checkFormModified(); // Ensure form modification is tracked
}

validateTag() {
  const regex = /^[a-zA-Z0-9_]*$/;
  this.isInvalidTag = !regex.test(this.currentRow.campaign_tag);
}
}
