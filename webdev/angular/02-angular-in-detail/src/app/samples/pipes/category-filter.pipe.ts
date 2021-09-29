import { Pipe, PipeTransform } from "@angular/core";
import { Product } from "../../product.model";

/**
 * The following pipes accepts an array of Products as its value and returns
 * a new array containing only those products whose category matches the
 * category provided to the pipe as its first argument.
 *
 * However, due to performance reasons, Angular does not automatically detect
 * changes in the content of arrays or objects. In other words, if a Product
 * is added, removed or an existing Product element is modified within the
 * array passed to the pipe, Angular will not invoke the pipe's transform
 * method (for more info on change detection and arrays see
 * structural-directives/for.directive.ts).
 *
 * To workaround this issue, pipes can be made `impure` by setting the
 * `pure: false` in the config passed to the Pipe decorator. For impure
 * pipes, Angular will invoke their transform method whenever a change
 * is detected anywhere in the application (which can be entirely unrelated
 * to the pipe's value). This is equivalent to the directive's `ngDoCheck`
 * life-cycle hook, which is invoked whenever a change is detected in the
 * application so that directive can react to changes not automatically
 * detected by Angular (such as changes in content of arrays or objects).
 *
 * Transform method in impure pipes must be as simple as possible due to the
 * frequency of invocations. Complex transform methods in impure pipes can
 * seriously harm the app performance.
 */
@Pipe({
  name: "categoryFilter",
  pure: false
})
export class CategoryFilterPipe implements PipeTransform {
  transform(value: Product[], category: string): any {
    return category === undefined || category === "" ?
      value :
      value.filter(product => product.category === category);
  }
}
