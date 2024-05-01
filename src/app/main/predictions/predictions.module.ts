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

import { PredictionsEditComponent } from "./predictions-edit/predictions-edit.component";
import { UserEditService } from "./predictions-edit/user-edit.service";
import { PredictionsListComponent } from "./predictions-list/predictions-list.component";
import { UserListService } from "./predictions-list/user-list.service";
import { PredictionsViewComponent } from "./predictions-view/predictions-view.component";
import { UserViewService } from "./predictions-view/user-view.service";
import { NewUserSidebarComponent } from "./predictions-list/new-user-sidebar/new-user-sidebar.component";
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from "../shared.module";
import { PredictionsNewComponent } from "./predictions-new/predictions-new.component";

// routing
const routes: Routes = [
  {
    path: "predictions",
    component: PredictionsListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "PredictionsListComponent" },
  },
  {
    path: "",
    component: PredictionsListComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "PredictionsListComponent" },
  },
  {
    path: "Predictions-new",
    component: PredictionsNewComponent,
    resolve: {
      uls: UserListService,
    },
    data: { animation: "PredictionsNewComponent" },
  },
  {
    path: "Predictions-view/:id",
    component: PredictionsViewComponent,
    resolve: {
      data: UserViewService,
      InvoiceListService,
    },
    data: { path: "view/:id", animation: "PredictionsViewComponent" },
  },
  {
    path: "Predictions-edit/:id",
    component: PredictionsEditComponent,
    resolve: {
      ues: UserEditService,
    },
    data: { animation: "PredictionsEditComponent" },
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
    PredictionsListComponent,
    PredictionsViewComponent,
    PredictionsEditComponent,
    NewUserSidebarComponent,
    PredictionsNewComponent,
    
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
    NgApexchartsModule,
  ],
  providers: [UserListService, UserViewService, UserEditService],
})
export class PredictionsModule {}
