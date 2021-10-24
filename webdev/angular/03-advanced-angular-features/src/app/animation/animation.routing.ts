import {Routes, RouterModule} from "@angular/router";
import { ProductFormComponent } from "./core/product-form.component";
import { ProductTableComponent } from "./core/product-table.component";
import {AnimationComponent} from "./animation.component";

const routes: Routes = [
  {
    path: "",
    component: AnimationComponent,
    children: [
      { path: "form/:mode/:id", component: ProductFormComponent },
      { path: "form/:mode", component: ProductFormComponent },
      { path: "table", component: ProductTableComponent },
      { path: "table/:category", component: ProductTableComponent },
      { path: "", redirectTo: "table", pathMatch: "full" }
    ]
  }
];

export const animationModuleRouting = RouterModule.forChild(routes);
