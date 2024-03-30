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

import { CompanyManagementEditComponent } from "./company-management-edit/company-management-edit.component";
import { UserEditService } from "./company-management-edit/user-edit.service";
import { CompanyManagementListComponent } from "./company-management-list/company-management-list.component";
import { UserListService } from "./company-management-list/user-list.service";
import { CompanyManagementViewComponent } from "./company-management-view/company-management-view.component";
import { UserViewService } from "./company-management-view/user-view.service";
import { NewUserSidebarComponent } from "./company-management-list/new-user-sidebar/new-user-sidebar.component";

import { SharedModule } from "../shared.module";

// routing
const routes: Routes = [
  {
    path: "company-management",
    component: CompanyManagementListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "CompanyManagementListComponent" },
  },
  {
    path: "",
    component: CompanyManagementListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "CompanyManagementListComponent" },
  },
  {
    path: "company-management-view/:id",
    component: CompanyManagementViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService,
    },
    data: { path: "view/:id", animation: "CompanyManagementViewComponent" },
  },
  {
    path: "company-management-edit/:id",
    component: CompanyManagementEditComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "CompanyManagementEditComponent" },
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
    CompanyManagementListComponent,
    CompanyManagementViewComponent,
    CompanyManagementEditComponent,
    NewUserSidebarComponent,
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
export class CompanyManagementModule {}
