import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LazyLoadedComponent } from "./lazy-loaded.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: LazyLoadedComponent }
    ])
  ],
  declarations: [ LazyLoadedComponent ]
})
export class LazyLoadedModule {
}
