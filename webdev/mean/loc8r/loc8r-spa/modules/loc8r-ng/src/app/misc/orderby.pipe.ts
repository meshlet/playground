import { Pipe, PipeTransform } from '@angular/core';

export type CompareFunction = (arg1: unknown, arg2: unknown) => number;

/**
 * A pipe that sorts the input array using the user-specified
 * compare function.
 *
 * @note This is a pure pipe meaning that its transform method
 * is invoked only if pipe's input array is replaced with a different
 * array instance. For cases where array needs to be sorted whenever
 * there's a change within the array itself (i.e. additional, removal
 * or element update) see orderby-impure.pipe.ts.
 */
@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(value: unknown[], compareFn: CompareFunction) {
    // @todo Implement
  }
}
