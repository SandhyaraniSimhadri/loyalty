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

import { EventsEditComponent } from "./events-edit/events-edit.component";
import { UserEditService } from "./events-edit/user-edit.service";
import { EventsListComponent } from "./events-list/events-list.component";
import { UserListService } from "./events-list/user-list.service";
import { EventsViewComponent } from "./events-view/events-view.component";
import { UserViewService } from "./events-view/user-view.service";
import { NewUserSidebarComponent } from "./events-list/new-user-sidebar/new-user-sidebar.component";

import { SharedModule } from "../shared.module";
// routing
const routes: Routes = [
  {
    path: "events",
    component: EventsListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "EventsListComponent" },
  },
  {
    path: "",
    component: EventsListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "EventsListComponent" },
  },
  {
    path: "events-view/:id",
    component: EventsViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService,
    },
    data: {
      path: "view/:id",
      animation: "EventsViewComponent",
    },
  },
  {
    path: "events-edit/:id",
    component: EventsEditComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "EventsEditComponent" },
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
    EventsListComponent,
    EventsViewComponent,
    EventsEditComponent,
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
export class EventsModule {}
