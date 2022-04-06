import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormatDistancePipe } from './format-distance.pipe';
import { OutputRatingDirective } from './output-rating.directive';

@NgModule({
  declarations: [OutputRatingDirective, FormatDistancePipe],
  imports: [BrowserModule],
  exports: [OutputRatingDirective, FormatDistancePipe]
})
export class MiscModule {}
