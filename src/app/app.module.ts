import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { FakeDbService } from "@fake-db/fake-db.service";

import "hammerjs";

import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";
import { ContextMenuModule } from "@ctrl/ngx-rightclick";

import { CoreModule } from "@core/core.module";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule, CoreThemeCustomizerModule } from "@core/components";
import { CardSnippetModule } from "@core/components/card-snippet/card-snippet.module";

import { coreConfig } from "app/app-config";
import { AuthGuard } from "app/auth/helpers/auth.guards";
import { fakeBackendProvider } from "app/auth/helpers"; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from "app/auth/helpers";
import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { ContextMenuComponent } from "app/main/extensions/context-menu/context-menu.component";
import { AnimatedCustomContextMenuComponent } from "./main/extensions/context-menu/custom-context-menu/animated-custom-context-menu/animated-custom-context-menu.component";
import { BasicCustomContextMenuComponent } from "./main/extensions/context-menu/custom-context-menu/basic-custom-context-menu/basic-custom-context-menu.component";
import { SubMenuCustomContextMenuComponent } from "./main/extensions/context-menu/custom-context-menu/sub-menu-custom-context-menu/sub-menu-custom-context-menu.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreTouchspinModule } from "@core/components/core-touchspin/core-touchspin.module";
import { LoginComponent } from "./main/login/login.component";


const appRoutes: Routes = [

  {
    path: "company",
    loadChildren: () =>
      import("./main/company/company.module").then(
        (m) => m.CompanyModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "events",
    loadChildren: () =>
      import("./main/events/events.module").then(
        (m) => m.EventsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "apps",
    loadChildren: () =>
      import("./main/apps/apps.module").then((m) => m.AppsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "pages",
    loadChildren: () =>
      import("./main/pages/pages.module").then((m) => m.PagesModule),
  },
  {
    path: "ui",
    loadChildren: () => import("./main/ui/ui.module").then((m) => m.UIModule),
    canActivate: [AuthGuard],
  },
  {
    path: "components",
    loadChildren: () =>
      import("./main/components/components.module").then(
        (m) => m.ComponentsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "extensions",
    loadChildren: () =>
      import("./main/extensions/extensions.module").then(
        (m) => m.ExtensionsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "forms",
    loadChildren: () =>
      import("./main/forms/forms.module").then((m) => m.FormsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "tables",
    loadChildren: () =>
      import("./main/tables/tables.module").then((m) => m.TablesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "charts-and-maps",
    loadChildren: () =>
      import("./main/charts-and-maps/charts-and-maps.module").then(
        (m) => m.ChartsAndMapsModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "dashboard",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full",
  },
  {
    path: "",
    component: LoginComponent,
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    ContextMenuComponent,
    BasicCustomContextMenuComponent,
    AnimatedCustomContextMenuComponent,
    SubMenuCustomContextMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true,
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "legacy",
    }),
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreTouchspinModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    // NgbNavModule,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // ! IMPORTANT: Provider used to create fake backend, comment while using real API
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
