import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { Ng2FlatpickrModule } from "ng2-flatpickr";

import { CoreCommonModule } from "@core/common.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreSidebarModule } from "@core/components";

import { InvoiceListService } from "app/main/apps/invoice/invoice-list/invoice-list.service";
import { InvoiceModule } from "app/main/apps/invoice/invoice.module";

import { CampaignsEditComponent } from "./campaigns-edit/campaigns-edit.component";
import { UserEditService } from "./campaigns-edit/user-edit.service";
import { CampaignsListComponent } from "./campaigns-list/campaigns-list.component";
import { UserListService } from "./campaigns-list/user-list.service";
import { CampaignsViewComponent } from "./campaigns-view/campaigns-view.component";
import { UserViewService } from "./campaigns-view/user-view.service";
import { NewUserSidebarComponent } from "./campaigns-list/new-user-sidebar/new-user-sidebar.component";

import { SharedModule } from "../shared.module";
import { CampaignsNewComponent } from "./campaigns-new/campaigns-new.component";
import { CampaignsReportComponent } from "./campaigns-report/campaigns-report.component";
// routing
const routes: Routes = [
  {
    path: "campaigns",
    component: CampaignsListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "CampaignsListComponent" },
  },
  {
    path: "",
    component: CampaignsListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "CampaignsListComponent" },
  },
  {
    path: "campaigns-view/:id",
    component: CampaignsViewComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "CampaignsViewComponent" },
  },
  {
    path: "campaigns-edit/:id",
    component: CampaignsEditComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "CampaignsEditComponent" },
  },
  {
    path: "campaigns-report/:id",
    component: CampaignsReportComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "CampaignsReportComponent" },
  },
  {
    path: "campaigns-new",
    component: CampaignsNewComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "CampaignsNewComponent" },
  },
  {
    path: "user-view",
    redirectTo: "/apps/user/user-view/2", // Redirection
  },
  {
    path: "user-edit",
    redirectTo: "/apps/user/user-edit/2", // Redirection
  },
];

@NgModule({
  declarations: [
    CampaignsListComponent,
    CampaignsViewComponent,
    CampaignsEditComponent,
    NewUserSidebarComponent,
    CampaignsNewComponent,
    CampaignsReportComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    InvoiceModule,
    CoreSidebarModule,
  ],
  providers: [UserListService, UserViewService, UserEditService],
})
export class CampaignsModule {}
