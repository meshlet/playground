import { Pipe, PipeTransform } from '@angular/core';

/**
 * Comparison callback call signature.
 */
export type CompareFunction<T> = (arg1: T, arg2: T) => number;

/**
 * A pipe that sorts the input array using the user-specified
 * compare function.
 *
 * @note This is a pure pipe meaning that its transform method
 * is invoked only if pipe's input array is replaced with a different
 * array instance. For cases where array needs to be sorted whenever
 * there's a change within the array itself (i.e. addition, removal
 * or element update) see orderby-impure.pipe.ts.
 */
@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform<T>(value: T[] | ArrayLike<T>, compareFn: CompareFunction<T>) {
    if (Array.isArray(value)) {
      return value.sort(compareFn);
    }
    const array = Array.from(value);
    return array.sort(compareFn);
  }
}
