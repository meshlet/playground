import {Routes, RouterModule} from "@angular/router";
import {AnimationComponent} from "./animation.component";

const routes: Routes = [
  {
    path: "",
    component: AnimationComponent,
    // children: [
    //   { path: "table", component: ProductTableComponent },
    //   { path: "table/:category", component: ProductTableComponent },
    //   { path: "", redirectTo: "table", pathMatch: "full" }
    // ]
  }
];

export const animationModuleRouting = RouterModule.forChild(routes);
