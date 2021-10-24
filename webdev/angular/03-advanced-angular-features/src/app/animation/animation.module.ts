import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from "./core/core.module";
import { AnimationComponent } from "./animation.component";
import { animationModuleRouting } from "./animation.routing";

@NgModule({
  imports: [
    CommonModule, NgbModule, CoreModule, animationModuleRouting
  ],
  declarations: [AnimationComponent],
  exports: [AnimationComponent]
})
export class AnimationModule {
}
