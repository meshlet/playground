import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFormatDistance'
})
export class FormatDistancePipe implements PipeTransform {
  transform(distance: unknown) {
    if (typeof distance === 'number') {
      return distance > 1000
        ? `${(distance / 1000).toFixed(1)}km`
        : `${Math.round(distance)}m`;
    }
    return 'unexpected input';
  }
}
