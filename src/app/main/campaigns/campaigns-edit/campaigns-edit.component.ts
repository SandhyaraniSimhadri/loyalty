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
interface BaseQuestion {
  id: string;
  type: "mcq" | "typing" | "audio" | "video" | "scenario" | "roleplaying";
  question: string;
  points: number;
}

interface McqQuestion extends BaseQuestion {
  type: "mcq";
  options: { a: string; b: string; c: string; d: string };
  answer: string;
}

interface TypingQuestion extends BaseQuestion {
  type: "typing";
  answer: string;
}

interface AudioQuestion extends BaseQuestion {
  type: "audio";
  audioFile: File | null;
  answer: string;
}

interface VideoQuestion extends BaseQuestion {
  type: "video";
  videoFile: File | null;
  answer: string;
}

interface ScenarioQuestion extends BaseQuestion {
  type: "scenario";
  options: { a: string; b: string; c: string; d?: string };
  answer: string;
}

interface RolePlayingQuestion extends BaseQuestion {
  type: "roleplaying";
  options: { [key: string]: string };
  resultMapping: { [key: string]: string };
  resultMappingString?: string;
}

type Question =
  | McqQuestion
  | TypingQuestion
  | AudioQuestion
  | VideoQuestion
  | ScenarioQuestion
  | RolePlayingQuestion;
@Component({
  selector: "app-campaigns-edit",
  templateUrl: "./campaigns-edit.component.html",
  styleUrls: ["./campaigns-edit.component.scss"],
})
export class CampaignsEditComponent implements OnInit, OnDestroy {
  typeOfQuiz: any;
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

  public selectedType:
    | "mcq"
    | "typing"
    | "audio"
    | "video"
    | "scenario"
    | "roleplaying" = "mcq";
  public questions: Question[] = [];
  currentQuestion: Question = this.createEmptyQuestion(this.selectedType);
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

  public companyData: any;
  public game_welcome_image: any;
  public thumbnail_image: any;

  public game_end_image: any;
  public game_start_image: any;
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

  public prizes = {
    id: 0,
    prize_header: "",
    prize_desc: "",
    selectedFile: null as File | null,
    file_name: "",
    isDragging: false,
    showUpload: false,
  };

  public prize = {
    prize_header: "",
    prize_desc: "",
    selectedFile: null as File | null,
    file_name: "",
    isDragging: false,
    showUpload: false,
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
  createEmptyQuestion(
    type: "mcq" | "typing" | "audio" | "video" | "scenario" | "roleplaying"
  ): any {
    if (type === "mcq") {
      return {
        id: "",
        type: "mcq",
        question: "",
        points: 0,
        options: [
          { id: "", option_key: "a", option_text: "", is_correct: "" },
          { id: "", option_key: "b", option_text: "", is_correct: "" },
          { id: "", option_key: "c", option_text: "", is_correct: "" },
          { id: "", option_key: "d", option_text: "", is_correct: "" },
        ],
        answer: "",
      };
    } else if (type === "typing") {
      return { id: "", type: "typing", question: "", points: 0, answer: "" };
    } else if (type === "audio") {
      return {
        id: "",
        type: "audio",
        question: "",
        points: 0,
        audioFile: null,
        answer: "",
      };
    } else if (type === "video") {
      return {
        id: "",
        type: "video",
        question: "",
        points: 0,
        videoFile: null,
        answer: "",
      };
    } else if (type === "scenario") {
      return {
        id: "",
        type: "scenario",
        question: "",
        points: 0,
        options: [
          { id: "", option_key: "a", option_text: "", is_correct: "" },
          { id: "", option_key: "b", option_text: "", is_correct: "" },
          { id: "", option_key: "c", option_text: "", is_correct: "" },
          { id: "", option_key: "d", option_text: "", is_correct: "" },
        ],
        answer: "",
      };
    } else {
      // roleplaying
      return {
        id: "",
        type: "roleplaying",
        question: "",
        points: 0,
        options: [
          { id: "", option_key: "a", option_text: "", is_correct: "" },
          { id: "", option_key: "b", option_text: "", is_correct: "" },
          { id: "", option_key: "c", option_text: "", is_correct: "" },
          { id: "", option_key: "d", option_text: "", is_correct: "" },
        ],
        resultMapping: {},
      };
    }
  }
  deleteQuestion(index: number) {
    if (this.questions.length > 1) this.questions.splice(index, 1);
    this.checkFormModified();
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
    var imageValue = "";
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
    this.currentQuestion = this.createEmptyQuestion(this.selectedType);
    this.questions.push({ ...this.currentQuestion });
    console.log("questionss", this.questions);
    this.checkFormModified();
  }

  async submit(form) {
    if (!form.valid) return;

    // Basic validations
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
      // --- Dynamic validation for quizzes based on type ---
      this.currentRow.quizzes = this.questions;
      const hasEmptyFields = this.currentRow.quizzes.some((q) => {
        if (!q.question || !q.points) return true;

        if (q.type === "mcq" || q.type === "scenario") {
          return (
            !q.options ||
            q.options.length < 2 ||
            q.options.some((opt) => !opt.option_text) ||
            !q.correct_answer
          );
        }

        if (q.type === "roleplaying") {
          return !q.result_mapping_json || q.result_mapping_json.trim() === "";
        }

        return false;
      });

      if (hasEmptyFields) {
        this.errorMsg = true;
        this._toastrService.error(
          "Please fill all required quiz fields",
          "Failed",
          {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          }
        );
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

    // --- Convert file to Base64 helper ---
    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      // --- Process games if event 1 ---
      const processedGames =
        this.currentRow.event_id == 1
          ? await Promise.all(
              this.currentRow.games.map(async (game) => ({
                ...game,
                team_a_image: game.team_a_image
                  ? await convertFileToBase64(game.team_a_image)
                  : null,
                team_b_image: game.team_b_image
                  ? await convertFileToBase64(game.team_b_image)
                  : null,
              }))
            )
          : [];

      // --- Process quizzes if event 2 ---
      const processedQuestions =
        this.currentRow.event_id == 2
          ? await Promise.all(
              this.currentRow.quizzes.map(async (question) => {
                const processed = {
                  ...question,
                  selectedFile: question.selectedFile
                    ? await convertFileToBase64(question.selectedFile)
                    : null,
                };

                // Ensure options or mapping are correctly formatted
                if (
                  question.type === "roleplaying" &&
                  question.result_mapping_json
                ) {
                  try {
                    processed.result_mapping = JSON.parse(
                      question.result_mapping_json
                    );
                  } catch {
                    processed.result_mapping = {};
                  }
                }

                if (question.type === "mcq" || question.type === "scenario") {
                  processed.options = question.options.map((opt) => ({
                    ...opt,
                    is_correct:
                      opt.option_text === question.correct_answer ? 1 : 0,
                  }));
                }

                return processed;
              })
            )
          : [];

      // --- Process prizes if event 3 ---
      const processedPrizes =
        this.currentRow.event_id == 3
          ? await Promise.all(
              this.currentRow.prizes.map(async (prize) => ({
                ...prize,
                selectedFile: prize.selectedFile
                  ? await convertFileToBase64(prize.selectedFile)
                  : null,
              }))
            )
          : [];

      // --- Build final payload ---
      const payload = {
        id: this.currentRow.id,
        campaign_title: this.currentRow.campaign_title,
        campaign_tag: this.currentRow.campaign_tag,
        start_date: this.currentRow.start_date,
        end_date: this.currentRow.end_date,
        event_id: this.currentRow.event_id,
        company_id: this.currentRow.company_id,
        title: this.currentRow.title,
        login_text: this.currentRow.login_text,
        welcome_text: this.currentRow.welcome_text,
        terms_and_conditions: this.currentRow.terms_and_conditions,
        game_type: this.currentRow.game_type,
        description: this.currentRow.description,
        duration: this.currentRow.duration,
        calculatePoints: String(this.currentRow.calc_points_immediately),
        logo_image: this.logo_image
          ? await convertFileToBase64(this.logo_image)
          : null,
        login_image: this.login_image
          ? await convertFileToBase64(this.login_image)
          : null,
        welcome_image: this.welcome_image
          ? await convertFileToBase64(this.welcome_image)
          : null,
        campaign_image: this.image
          ? await convertFileToBase64(this.image)
          : null,
        game_start_image: this.game_start_image
          ? await convertFileToBase64(this.game_start_image)
          : null,
        game_end_image: this.game_end_image
          ? await convertFileToBase64(this.game_end_image)
          : null,
        game_welcome_image: this.game_welcome_image
          ? await convertFileToBase64(this.game_welcome_image)
          : null,
        thumbnail_image: this.thumbnail_image
          ? await convertFileToBase64(this.thumbnail_image)
          : null,
        games: processedGames,
        questions: processedQuestions,
        prizes: processedPrizes,
        html_games: this.currentRow.html_games,
      };

      // --- Send payload ---
      this.http
        .post<any>(this.apiUrl + "api/update_campaign", payload)
        .subscribe(
          (res: any) => {
            this.buttonLoading = false;
            if (!res.status) {
              this._toastrService.error(res.msg, "Failed", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
            } else {
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
  onTypeSelectChange() {
    this.questions = [];
    this.questions.push(this.createEmptyQuestion(this.selectedType));
  }
  getSingleCampaign() {
    this.loading = true;

    const request = {
      params: { id: this.urlLastValue },
      action_url: "get_single_campaign",
      method: "POST",
    };

    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        this.loading = false;

        if (!res || res === "nonet" || res.status === false) return;

        const campaign = res.data[0];
        this.currentRow =
          this.modalsService.replaceNullsWithEmptyStrings(campaign);
        if (campaign.event_title == "QUIZ") {
          if (campaign.quizzes.length > 0) {
            this.selectedType = campaign.quizzes[0].type;
          }
        }

        /** 🎯 Handle Event-specific Data */
        switch (campaign.event_title) {
          case "PREDICTION EVENT":
            this.games = campaign.games || [];
            break;

          case "QUIZ":
            this.questions = (campaign.quizzes || []).map((quiz: any) => ({
              id: quiz.id || 0,
              type: quiz.type || "mcq",
              question: quiz.question || "",
              points: Number(quiz.points) || 0,
              correct_answer: quiz.correct_answer || "",
              media_path: quiz.media_path || null,
              media_type: quiz.media_type || "none",
              media_url: quiz.media_url || null,
              file_name: quiz.file_name || null,
              selectedFile: null, // For UI image preview
              updated: false,
              // If options exist, normalize them
              options: Array.isArray(quiz.options)
                ? quiz.options.map((opt: any) => ({
                    id: opt.id || 0,
                    option_key: opt.option_key || "",
                    option_text: opt.option_text || "",
                    is_correct: opt.is_correct || 0,
                  }))
                : [],
              // Roleplaying / Scenario mapping
              result_mapping: quiz.result_mapping || null,
            }));
            break;

          case "GAMES":
            this.currentRow.html_games = (campaign.html_games || [])[0] || {};
            this.currentRow.prizes = campaign.prizes || [];
            break;
        }
        console.log("show questions", this.currentRow.quizzes);

        /** 🧠 Normalize Other Fields */
        if (this.currentRow.calc_points_immediately === "false") {
          this.currentRow.calc_points_immediately = false;
        }

        /** 📦 Keep backup copies for reset/edit tracking */
        this.originalFormValues = { ...this.currentRow };
        this.tempRow = cloneDeep(this.currentRow);

        /** 🖼️ Load Avatar if exists */
        if (this.currentRow.avatar) {
          this.avatarImage = this.apiUrl + this.currentRow.avatar;
        }

        console.log("Loaded campaign:", this.currentRow);
        console.log("Loaded questions:", this.questions);
      },
      (error: any) => {
        console.error("Error loading campaign:", error);
        this.loading = false;
      }
    );
  }

  addPrize() {
    this.currentRow.prizes.push({
      id: 0,
      prize_header: "",
      prize_desc: "",
      selectedFile: null as File | null,
      file_name: "",
      isDragging: false,
      showUpload: false,
    });
    this.checkFormModified();
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
  onFileSelected(event: any, item) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        item.preview = reader.result;
      };

      reader.readAsDataURL(file);

      item.selectedFile = file;
      item.updated = true;
      console.log("File selected:", item.selectedFile);
      item.file_name = item.selectedFile.name;
    }
  }
  toggleUpload(item) {
    item.file_name = !item.file_name;
    console.log("upload", item.showUpload);
  }

  onTagChange() {
    this.validateTag();
    this.checkFormModified(); // Ensure form modification is tracked
  }

  validateTag() {
    const regex = /^[a-zA-Z0-9_]*$/;
    this.isInvalidTag = !regex.test(this.currentRow.campaign_tag);
  }
  deletePrize(id: any) {
    for (let i = 0; i < this.currentRow.prizes.length; i++) {
      if (this.currentRow.prizes.indexOf(this.currentRow.prizes[i]) === id) {
        this.currentRow.prizes.splice(i, 1);
        break;
      }
    }
  }
}
