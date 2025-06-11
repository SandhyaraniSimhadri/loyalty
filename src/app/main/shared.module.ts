// shared.module.ts
import { NgModule } from "@angular/core";
import { TruncatePipe } from "./truncate.pipe";
import { GoogleSigninComponent } from './google-signin/google-signin.component';

@NgModule({
  declarations: [GoogleSigninComponent, TruncatePipe],
  exports: [TruncatePipe],
})
export class SharedModule {}
