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

import { UsersEditComponent } from "./users-edit/users-edit.component";
import { UserEditService } from "./users-edit/user-edit.service";
import { UsersListComponent } from "./users-list/users-list.component";
import { UserListService } from "./users-list/user-list.service";
import { UsersViewComponent } from "./users-view/users-view.component";
import { UserViewService } from "./users-view/user-view.service";
import { NewUserSidebarComponent } from "./users-list/new-user-sidebar/new-user-sidebar.component";

import { SharedModule } from "../shared.module";
// routing
const routes: Routes = [
  {
    path: "users",
    component: UsersListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "UsersListComponent" },
  },
  {
    path: "",
    component: UsersListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "UsersListComponent" },
  },
  {
    path: "users-view/:id",
    component: UsersViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService,
    },
    data: {
      path: "view/:id",
      animation: "UsersViewComponent",
    },
  },
  {
    path: "users-edit/:id",
    component: UsersEditComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "UsersEditComponent" },
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
    UsersListComponent,
    UsersViewComponent,
    UsersEditComponent,
    NewUserSidebarComponent
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
export class UsersModule {}
