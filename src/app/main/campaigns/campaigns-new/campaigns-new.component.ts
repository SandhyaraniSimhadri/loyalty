import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

import { ViewEncapsulation } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";

import {
  NgbDateStruct,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbTimeStruct,
} from "@ng-bootstrap/ng-bootstrap";

import * as snippet from "app/main/forms/form-elements/date-time-picker/date-time-picker.snippetcode";

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
  public terms_and_conditions: any;
  public description: any;
  public welcome_image: any;
  public logo_image: any;
  public campaign_tag: any;
  public welcome_text: any;
  public login_text: any;
  public login_image: any;
  public campaign_image: any;
  public game_welcome_image: any;
  public thumbnail_image:any;
  public game_end_image: any;
  public game_start_image: any;
  public game_welcome_text: any;
  public game_url: any;
  public game_type: any;

  public start_date: any;
  public end_date: any;
  public event_id: any;
  public eventsData: any;
  public company_id: any;
  public title: any;
  public errorMsg: any = false;
  public durationMsg: any = false;
  public selected_primary_color: string = "#3c3da6";
  public selected_page_color: string = "#3c3da6";
  public selected_welcomepage_button_color:string = "#3c3da6";
  public selected_secondary_color: string = "#3c3da6";
  public selected_startpage_color: string = "#3c3da6";
  public selected_overpage_color: string = "#3c3da6";

 
  public duration: any = 0;
  public calculatePoints: boolean = false;

  public games = [
    {
      id: "",
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
      id: "",
      question: "",
      response_a: "",
      response_b: "",
      response_c: "",
      response_d: "",
      answer: "",
      points: "",
      selectedFile: null as File | null,
      file_name: "",
      isDragging: false,
      showUpload: false,
    },
  ];

  public prizes = [
    {
      id: "",
      prize_header: "",
      prize_desc: "",
      selectedFile: null as File | null,
      file_name: "",
      isDragging: false,
      showUpload: false,
    },
  ];

  public prize = [
    {
      prize_header: "",
      prize_desc: "",
      selectedFile: null as File | null,
      file_name: "",
      isDragging: false,
      showUpload: false,
    },
  ];

  isInvalidTag: boolean = false;
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
    answer: "",
    points: "",
    selectedFile: null as File | null,
    file_name: "",
    isDragging: false,
    showUpload: false,
  };

  public companyData: any;
  public fileName: any = "";

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
    private _router: Router
  ) {
    if (this.httpService.USERINFO.role == "Sub Admin") {
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
      id: "",
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
  }
  deleteItem(id) {
    for (let i = 0; i < this.games.length; i++) {
      if (this.games.indexOf(this.games[i]) === id) {
        this.games.splice(i, 1);
        break;
      }
    }
  }

  addQuestion() {
    this.questions.push({
      id: "",
      question: "",
      response_a: "",
      response_b: "",
      response_c: "",
      response_d: "",
      answer: "",
      points: "",
      selectedFile: null as File | null,
      file_name: "",
      isDragging: false,
      showUpload: false,
    });
  }
  deleteQuestion(id) {
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions.indexOf(this.questions[i]) === id) {
        this.questions.splice(i, 1);
        break;
      }
    }
  }

  addPrize() {
    this.prizes.push({
      id: "",
      prize_header: "",
      prize_desc: "",
      selectedFile: null as File | null,
      file_name: "",
      isDragging: false,
      showUpload: false,
    });
  }
  deletePrize(id) {
    for (let i = 0; i < this.prizes.length; i++) {
      if (this.prizes.indexOf(this.prizes[i]) === id) {
        this.prizes.splice(i, 1);
        break;
      }
    }
  }

  submit(form) {
    // Validation logic remains the same...

    this.loading = true;

    // Convert files to Base64
    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const processFiles = async () => {
      const gamesData = this.games.map(async (game) => {
        return {
          ...game,
          team_a_image: game.team_a_image
            ? await convertFileToBase64(game.team_a_image)
            : null,
          team_b_image: game.team_b_image
            ? await convertFileToBase64(game.team_b_image)
            : null,
        };
      });

      const questionsData = this.questions.map(async (question) => {
        return {
          ...question,
          selectedFile: question.selectedFile
            ? await convertFileToBase64(question.selectedFile)
            : null,
        };
      });

      const prizesData = this.prizes.map(async (prize) => {
        return {
          ...prize,
          selectedFile: prize.selectedFile
            ? await convertFileToBase64(prize.selectedFile)
            : null,
        };
      });

      const processedGames = await Promise.all(gamesData);
      const processedQuestions = await Promise.all(questionsData);
      const processedPrizes = await Promise.all(prizesData);

      const payload = {
        campaign_title: this.campaign_title,
        start_date: this.start_date,
        end_date: this.end_date,
        campaign_tag: this.campaign_tag,
        event_id: this.event_id,
        company_id: this.company_id,
        duration: this.duration,
        title: this.title,
        login_tet: this.login_text,
        welcome_text: this.welcome_text,
        game_welcome_text: this.game_welcome_text,
        selected_primary_color: this.selected_primary_color,
        selected_secondary_color: this.selected_secondary_color,
        selected_startpage_color: this.selected_startpage_color,
        selected_overpage_color: this.selected_overpage_color,
        selected_page_color: this.selected_page_color,
        selected_welcomepage_button_color:this.selected_welcomepage_button_color,
        game_url: this.game_url,
        terms_and_conditions: this.terms_and_conditions,
        game_type: this.game_type,
        description: this.description,
        calculatePoints: this.calculatePoints,
        logo_image: this.logo_image
          ? await convertFileToBase64(this.logo_image)
          : null,
        game_welcome_image: this.game_welcome_image
          ? await convertFileToBase64(this.game_welcome_image)
          : null,
              thumbnail_image: this.thumbnail_image
          ? await convertFileToBase64(this.thumbnail_image)
          : null,
        login_image: this.login_image
          ? await convertFileToBase64(this.login_image)
          : null,
        welcome_image: this.welcome_image
          ? await convertFileToBase64(this.welcome_image)
          : null,
        campaign_image: this.campaign_image
          ? await convertFileToBase64(this.campaign_image)
          : null,

        game_start_image: this.game_start_image
          ? await convertFileToBase64(this.game_start_image)
          : null,
        game_end_image: this.game_end_image
          ? await convertFileToBase64(this.game_end_image)
          : null,

        games: this.event_id == 1 ? processedGames : [],
        questions: this.event_id == 2 ? processedQuestions : [],
        prizes: this.event_id == 3 ? processedPrizes : [],
      };

      // Send as JSON
      this.http.post<any>(this.apiUrl + "api/add_campaign", payload).subscribe(
        (res: any) => {
          this.loading = false;
          if (!res.status) {
            this._toastrService.error(res.msg, "Failed", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          } else {
            // this.onCampaignAdded.emit(res.data);

            if (res.tag == "Duplicate") {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else {
              this._toastrService.success(res.msg, "Success", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
              this._router.navigate(["/campaigns/campaigns"]);
            }
          }
        },
        (error: any) => {
          this.loading = false;
          this._toastrService.error("An error occurred", "Failed", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        }
      );
    };

    processFiles();
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

  uploadImage(event: any, type) {
    this.loading = true;
    if (type == "welcome") {
      this.welcome_image = event.target.files[0];
    } else if (type == "logo") {
      this.logo_image = event.target.files[0];
    } else if (type == "campaign") {
      this.campaign_image = event.target.files[0];
    } else if (type == "game_start") {
      this.game_start_image = event.target.files[0];
    } else if (type == "game_end") {
      this.game_end_image = event.target.files[0];
    } else if (type == "welcome_game") {
      this.game_welcome_image = event.target.files[0];
    } else if (type == "thumbnail_image") {
      this.thumbnail_image = event.target.files[0];
    } else {
      this.login_image = event.target.files[0];
    }

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
      this.start_date = null;
      this.end_date = null;
      this._toastrService.error(
        "Start date must be less than end date. Both dates have been reset.",
        "Error",
        {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        }
      );
    }
  }

  uploadTeamAImage(i: any, event: any) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {};
      reader.readAsDataURL(event.target.files[0]);
      this.games[i].team_a_image = event.target.files[0];
      console.log("valueee will be", event.target.files[0]);
      console.log("imgave valuree", this.games[i].team_a_image);
    }
    this.loading = false;
    // this.checkFormModified();
  }
  uploadTeamBImage(i: any, event: any) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {};
      reader.readAsDataURL(event.target.files[0]);
      this.games[i].team_b_image = event.target.files[0];
      console.log("image value", this.games[i].team_b_image);
      // return;
    }
    this.loading = false;
    // this.checkFormModified();
  }
  onDragOver(event: DragEvent, item) {
    event.preventDefault();
    item.isDragging = true;
  }

  onDragLeave(event: DragEvent, item) {
    event.preventDefault();
    item.isDragging = false;
  }

  onDrop(event: DragEvent, item) {
    event.preventDefault();
    item.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      item.selectedFile = event.dataTransfer.files[0];
      console.log("File dropped:", item.selectedFile);
    }
  }

  onFileSelected(event: any, item) {
    const file = event.target.files[0];
    if (file) {
      item.selectedFile = file;
      console.log("File selected:", item.selectedFile);
      item.fileName = item.selectedFile.name;
    }
  }
  toggleUpload(item) {
    item.showUpload = !item.showUpload;
  }
  validateTag(): void {
    const regex = /^[a-zA-Z0-9_]*$/;
    this.isInvalidTag = !regex.test(this.campaign_tag);
  }
}
