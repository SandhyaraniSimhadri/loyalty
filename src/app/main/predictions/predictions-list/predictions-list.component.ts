import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { UserListService } from "./user-list.service";
import { CoreHttpService } from "@core/services/http.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { ModalsService } from "@core/services/modals.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
// UserListService
import { colors } from "app/colors.const";
import { User } from "app/auth/models";
import { AuthenticationService } from "app/auth/service";

@Component({
  selector: "app-predictions-list",
  templateUrl: "./predictions-list.component.html",
  styleUrls: ["./predictions-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PredictionsListComponent implements OnInit {
  // Public
  public isMenuToggled = false;

  @ViewChild("earningChartRef") earningChartRef: any;
  public teamAChartOptions;
  public teamBChartOptions;

  private $earningsStrokeColor2 = "#28c76f66";
  private $earningsStrokeColor3 = "#28c76f33";
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousStatusFilter = "";
  public apiUrl: any;
  public apiUrl_web: any;
  public campaign_data: any;
  public selectChurch: any = [];
  public selectUsers: any = [];
  public selectLanguage: any = [];
  public loading: boolean = false;
  public searchValue = "";
  public selectedChurch = [];
  public selectedUsers = [];
  public selectedLanguage = [];
  public buttonLoading: any = false;
  public currentUser: User;
  public selectedWinner:any=false;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _userListService: UserListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    public httpService: CoreHttpService,
    public modalsService: ModalsService,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private _authenticationService: AuthenticationService
  ) {
    this._authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
    console.log("current user", this.currentUser);

    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    // this.selectedChurch = this.selectChurch[0];
    // this.selectedUsers = this.selectUsers[0];
    // this.selectedLanguage = this.selectLanguage[0];

    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.company_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByChurch(event) {
    const filter = event ? event.value : "";
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(
      filter,
      this.previousPlanFilter,
      this.previousStatusFilter
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  filterByUsers(event) {
    const filter = event ? event.value : "";
    this.previousPlanFilter = filter;
    this.temp = this.filterRows(
      this.previousRoleFilter,
      filter,
      this.previousStatusFilter
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Status
   *
   * @param event
   */
  filterByLanguage(event) {
    const filter = event ? event.value : "";
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(
      this.previousRoleFilter,
      this.previousPlanFilter,
      filter
    );
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param churchFilter
   * @param usersFilter
   * @param languageFilter
   */
  filterRows(churchFilter, usersFilter, languageFilter): any[] {
    // Reset search on select change
    this.searchValue = "";

    churchFilter = churchFilter.toLowerCase();
    usersFilter = usersFilter.toLowerCase();
    languageFilter = languageFilter.toLowerCase();
    return this.tempData.filter((row) => {
      const isPartialNameMatch =
        row.church_name.toLowerCase().indexOf(churchFilter) !== -1 ||
        !churchFilter;
      const isPartialUsersMatch =
        row.users.toLowerCase().indexOf(usersFilter) !== -1 || !usersFilter;
      const isPartialLanguageMatch =
        row.language.toLowerCase().indexOf(languageFilter) !== -1 ||
        !languageFilter;
      return (
        isPartialNameMatch && isPartialUsersMatch && isPartialLanguageMatch
      );
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.apiUrl = environment.apiUrl;
    this.apiUrl_web = environment.apiUrl_web;

    this.getPredictions();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getPredictions() {
    this.loading = true;
    let request;

    request = {
      params: null,
      action_url: "get_prediction_details",
      method: "GET",
    };
    this.httpService.doHttp(request).subscribe(
      (res: any) => {
        if (res == "nonet") {
        } else {
          if (res.status == false) {
          } else if (res.status == true) {
            this.rows = res.data;
            this.campaign_data = this.rows[0];
            // if( this.campaign_data.games[0].team_name){
             
            // }else{
            //   this.campaign_data.games[0].team_name=null;
            // }
            // console.log("valueeee", this.campaign_data.participants[0].team_name)
           
            console.log("@team a", this.campaign_data.games[0]);
            this.tempData = this.rows;
            const teamAPercentage =
              this.campaign_data.games[0].team_a_percentage;
            const teamBPercentage =
              this.campaign_data.games[0].team_b_percentage;
            const teamASelectedPercentage = teamAPercentage;
            const teamBSelectedPercentage = teamBPercentage;
            const teamANotSelectedPercentage = 100 - teamAPercentage;
            const teamBNotSelectedPercentage = 100 - teamBPercentage;

            // Update chart options for team A
            // this.teamAChartOptions.series = [
            //   teamASelectedPercentage,
            //   teamANotSelectedPercentage,
            // ];
            // this.teamAChartOptions.labels = ["Selected", "Not Selected"];

            // // Update chart options for team B
            // this.teamBChartOptions.series = [
            //   teamBSelectedPercentage,
            //   teamBNotSelectedPercentage,
            // ];
            // this.teamBChartOptions.labels = ["Selected", "Not Selected"];

            this.teamAChartOptions = {
              chart: {
                type: "donut",
                height: 120,
                toolbar: {
                  show: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
              series: [teamASelectedPercentage, teamANotSelectedPercentage],
              legend: { show: false },
              comparedResult: [2, 0],
              labels: ["Selected", "Not Selected"],
              stroke: { width: 0 },
              colors: [
                this.$earningsStrokeColor2,
                this.$earningsStrokeColor3,
                colors.solid.success,
              ],
              grid: {
                padding: {
                  right: -20,
                  bottom: -8,
                  left: -20,
                },
              },
              plotOptions: {
                pie: {
                  // startAngle: -10,
                  donut: {
                    labels: {
                      show: true,
                      name: {
                        // offsetY: 15
                      },
                      value: {
                        // offsetY: -15,
                        formatter: function (val) {
                          return parseInt(val) + "%";
                        },
                      },
                      total: {
                        show: true,
                        // offsetY: 15,
                        label: this.campaign_data.games[0].team_a,
                        formatter: function (w) {
                          return `${teamAPercentage}%`;
                        },
                      },
                    },
                  },
                },
              },

              responsive: [
                {
                  breakpoint: 1325,
                  options: {
                    chart: {
                      height: 100,
                    },
                  },
                },
                {
                  breakpoint: 1200,
                  options: {
                    chart: {
                      height: 120,
                    },
                  },
                },
                {
                  breakpoint: 1065,
                  options: {
                    chart: {
                      height: 100,
                    },
                  },
                },
                {
                  breakpoint: 992,
                  options: {
                    chart: {
                      height: 120,
                    },
                  },
                },
              ],
            };

            this.teamBChartOptions = {
              chart: {
                type: "donut",
                height: 120,
                toolbar: {
                  show: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
              series: [teamBSelectedPercentage, teamBNotSelectedPercentage],
              legend: { show: false },
              comparedResult: [2, 0],
              labels: ["Selected", "Not Selected"],
              stroke: { width: 0 },
              colors: [
                this.$earningsStrokeColor2,
                this.$earningsStrokeColor3,
                colors.solid.success,
              ],
              grid: {
                padding: {
                  right: -20,
                  bottom: -8,
                  left: -20,
                },
              },
              plotOptions: {
                pie: {
                  // startAngle: -10,
                  donut: {
                    labels: {
                      show: true,
                      name: {
                        // offsetY: 15
                      },
                      value: {
                        // offsetY: -15,
                        formatter: function (val) {
                          return parseInt(val) + "%";
                        },
                      },
                      total: {
                        show: true,
                        // offsetY: 15,
                        label: this.campaign_data.games[0].team_b,
                        formatter: function (w) {
                          return `${teamBPercentage}%`;
                        },
                      },
                    },
                  },
                },
              },

              responsive: [
                {
                  breakpoint: 1325,
                  options: {
                    chart: {
                      height: 100,
                    },
                  },
                },
                {
                  breakpoint: 1200,
                  options: {
                    chart: {
                      height: 120,
                    },
                  },
                },
                {
                  breakpoint: 1065,
                  options: {
                    chart: {
                      height: 100,
                    },
                  },
                },
                {
                  breakpoint: 992,
                  options: {
                    chart: {
                      height: 120,
                    },
                  },
                },
              ],
            };
          }
        }
        
    setTimeout(() => {
      // Get Dynamic Width for Charts
      this.isMenuToggled = true;

      this.teamAChartOptions.chart.width =
        this.earningChartRef?.nativeElement.offsetWidth;
      this.teamBChartOptions.chart.width =
        this.earningChartRef?.nativeElement.offsetWidth;
    }, 1000);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  ngAfterViewInit() {
    // Subscribe to core config changes

    // If Menu Collapsed Changes

  }
  selectWinner(){
    console.log("test",this.selectedWinner);
    this.loading=true;
    let request = {
      params: { selected_winner: this.selectedWinner,campaign_id:this.campaign_data.id },
      action_url: "add_prediction_winner",
      method: "POST",
    };
    this.httpService.doHttp(request).subscribe(
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
            this.modalService.dismissAll();
            this.getPredictions();
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
}
