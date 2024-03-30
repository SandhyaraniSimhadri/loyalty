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

import { CompanyEditComponent } from "./company-edit/company-edit.component";
import { UserEditService } from "./company-edit/user-edit.service";
import { CompanyListComponent } from "./company-list/company-list.component";
import { UserListService } from "./company-list/user-list.service";
import { CompanyViewComponent } from "./company-view/company-view.component";
import { UserViewService } from "./company-view/user-view.service";
import { NewUserSidebarComponent } from "./company-list/new-user-sidebar/new-user-sidebar.component";

import { SharedModule } from "../shared.module";

// routing
const routes: Routes = [
  {
    path: "company",
    component: CompanyListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "CompanyListComponent" },
  },
  {
    path: "",
    component: CompanyListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "CompanyListComponent" },
  },
  {
    path: "company-view/:id",
    component: CompanyViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService,
    },
    data: { path: "view/:id", animation: "CompanyViewComponent" },
  },
  {
    path: "company-edit/:id",
    component: CompanyEditComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "CompanyEditComponent" },
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
    CompanyListComponent,
    CompanyViewComponent,
    CompanyEditComponent,
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
export class CompanyModule {}
