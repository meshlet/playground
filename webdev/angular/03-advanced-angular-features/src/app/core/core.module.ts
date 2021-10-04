import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { TrackModeService } from "./track-mode.service";
import { ProductTableComponent } from "./product-table.component";
import { ProductFormComponent } from "./product-form.component";
import { ModelModule } from "../model/model.module";

@NgModule({
  imports: [BrowserModule, FormsModule, ModelModule],
  declarations: [ProductFormComponent, ProductTableComponent],
  providers: [TrackModeService],
  exports: [ProductTableComponent, ProductFormComponent, ModelModule]
})
export class CoreModule {
}
