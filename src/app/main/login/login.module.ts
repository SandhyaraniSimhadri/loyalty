import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { LoginComponent } from './login.component';

// routing
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },

];

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class LoginModule {}
