// shared.module.ts
import { NgModule } from "@angular/core";
import { TruncatePipe } from "./truncate.pipe";

@NgModule({
  declarations: [TruncatePipe],
  exports: [TruncatePipe], // Make the pipe exportable
})
export class SharedModule {}
