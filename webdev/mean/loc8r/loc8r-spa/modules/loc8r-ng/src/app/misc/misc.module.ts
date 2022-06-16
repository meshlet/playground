import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessageComponent } from './flash-message.component';
import { FormatDistancePipe } from './format-distance.pipe';
import { GeolocationService } from './geolocation.service';
import { OrderByPipe } from './orderby.pipe';
import { OutputRatingDirective } from './output-rating.directive';
import { PasswordValidatorDirective } from './password-validator.directive';
import { ReporterService } from './reporter.service';

@NgModule({
  declarations: [OutputRatingDirective, FormatDistancePipe, FlashMessageComponent, OrderByPipe, PasswordValidatorDirective],
  providers: [ReporterService, GeolocationService],
  imports: [BrowserModule, NgbModule],
  exports: [OutputRatingDirective, FormatDistancePipe, FlashMessageComponent, OrderByPipe]
})
export class MiscModule {}
