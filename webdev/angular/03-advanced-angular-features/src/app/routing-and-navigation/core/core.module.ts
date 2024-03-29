import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

/**
 * RouterModule provides the directives that templates can use to
 * perform routing, such as the directive that selects the `routerLink`
 * attribute and modifies the URL based on its value.
 */
import { RouterModule } from "@angular/router";
import { ProductTableComponent } from "./product-table.component";
import { ProductFormComponent } from "./product-form.component";
import { ModelModule } from "../model/model.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ProductCountComponent } from "./product-count.component";
import { CategoryCountComponent } from "./category-count.component";
import { NotFoundComponent } from "./not-found.component";
import {UnsavedChangesGuardService} from "./unsaved-changes-guard.service";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule, FormsModule, ModelModule, NgbModule, RouterModule],
  declarations: [
    ProductFormComponent, ProductTableComponent, ProductCountComponent, CategoryCountComponent,
    NotFoundComponent
  ],
  providers: [ UnsavedChangesGuardService ],
  exports: [ProductTableComponent, ProductFormComponent, ModelModule]
})
export class CoreModule {
}
