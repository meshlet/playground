import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessageComponent } from './flash-message.component';
import { FormatDistancePipe } from './format-distance.pipe';
import { OutputRatingDirective } from './output-rating.directive';
import { ReporterService } from './reporter.service';

@NgModule({
  declarations: [OutputRatingDirective, FormatDistancePipe, FlashMessageComponent],
  providers: [ReporterService],
  imports: [BrowserModule, NgbModule],
  exports: [OutputRatingDirective, FormatDistancePipe, FlashMessageComponent]
})
export class MiscModule {}
