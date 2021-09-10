import { Component, Output, EventEmitter } from "@angular/core";
import { Product } from "../../product.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: "product-form",
  templateUrl: "product-form.component.html",

  /**
   * The following defines inline styles applied only to this component's
   * template.
   */
  styles: [
    "label { color: dodgerblue; }",

    /**
     * The special :host selector selects the component's host element, making
     * it possible to style the host element in which case the styling is inherited
     * by its children. For in-depth explanation of View Encapsulation in Angular
     * see product-table.component.ts. Angular limits the following styles to the
     * host element by using the same technique as described there. Angular will
     * generate a unique ID and produce the following CSS:
     *
     * [nghost-son-c123]:hover { font-weight: bold; font-size: 20px; }
     *
     * while the host element will have the `nghost-son-c123` attribute
     *
     * <product-form nghost-son-c123=""></product-form>
     *
     * which means that this style is applied only to the host element and via
     * style inheritance to its children in case they don't override the same
     * styles themselves.
     *
     * @note Assume the following HTML markup for the host element:
     *
     * <product-form>
     *   <p>First paragraph.</p>
     * </product-form>
     *
     * the following HTML in the template itself:
     *
     * <ng-content></ng-content>
     * <p>Second paragraph</p>
     *
     * and the component style has the following CSS:
     *
     * :host p { background-color: dodgerblue; }
     *
     * Angular will emit the following CSS:
     *
     * :host[nghost-wwf-c123] p[ngcontent-wwf-c123] { background-color: dodgerblue; }
     *
     * and the following HTML will be produced by merging the contents of the host element
     * (<product-form>) and the template content:
     *
     * <product-form nghost-wwf-c123>
     *   <p>First paragraph.</p>
     *   <p ngcontent-wwf-c123>Second paragraph</p>
     * </product-form>
     *
     * Note that Angular didn't add the `ngcontent-wwf-c123` attribute to the paragraph element
     * which was placed in the content of the product-form host element, while it did add it
     * to the paragraph in the template. Because of this, the styling will be applied only to
     * the second paragraph element, even though both paragraphs are product-from element's
     * children.
     *
     * In more general terms, styling rules involving :host selector which target host element
     * children will NOT match any children elements which appear in the content of the host element.
     * Only children in the template will be affected by such styles.
     *
     * @note CSS styles applied to the host element `leak` into the component's shadow DOM,
     * in a sense that inheritable CSS styles applied to the host element are inherited by
     * all the elements in the component's template (unless overridden by more specific
     * rules). Note that both `font-weight` and `font-size` are inheritable styles, hence
     * the CSS rule defined below will affect the HTML elements in the component's template.
     */
    ":host > :hover { font-weight: bold; font-size: 20px; }",

    /**
     * The special :host-context selector is used to apply CSS styles to the component's
     * template but only if the host element or any of its ancestors belong to a class
     * provided as an argument to this selector.
     *
     * For illustration purposes, let's say the CSS styles are:
     *
     * :host-context(.hostContextIllustration1) input { color: blueviolet; }
     * :host-context(.hostContextIllustration2) label { background-color: coral; }
     *
     * and the HTML (after Angular merges the template HTML into the index.html) looks
     * like this:
     *
     * <body class="hostContextIllustration2">
     *   <app-root>
     *     <div>
     *       <product-form class="hostContextIllustration1">
     *         <label for="anInput">Label:</label>
     *         <input type="text" id="anInput">
     *       </product-form>
     *     </div>
     *   </app-root>
     * </body>
     *
     * Angular will transform the CSS styles into something like this:
     *
     * .hostContextIllustration1[nghost-upd-c123] input[ngcontent-upd-c123], .hostContextIllustration1 [nghost-upd-c123] input[ngcontent-upd-c123] {
     *   color: blueviolet;
     * }
     * .hostContextIllustration2[nghost-upd-c123] label[ngcontent-upd-c123], .hostContextIllustration2 [nghost-upd-c123] label[ngcontent-upd-c123] {
     *   background-color: coral;
     * }
     *
     * The first part of the rule `.hostContextIllustration1[nghost-upd-c123] input[ngcontent-upd-c123]` will match all
     * input elements with the `ngcontent-upd-c123` attribute that are children (at any level) of an element with the
     * `nghost-upd-c123` attribute which also belongs to the `.hostContextIllustration1` class.
     *
     * The second part of the rule `.hostContextIllustration1 [nghost-upd-c123] input[ngcontent-upd-c123]` matches
     * all input elements with the `ngcontent-upd-c123` attribute that are children (at any level) of an element
     * with the `nghost-upd-c123` attribute who in turn is a child of an element that belongs to the
     * `.hostContextIllustration1` class.
     *
     * These two together make sure that if the host element itself (the first part of the rule above) or any of its
     * ancestors (the second part) belong to the `.hostContextIllustration1` class, any input elements in components
     * template (or within the content of the product-form element) will use the given CSS style. To make this work,
     * Angular generates the following HTML:
     *
     * <body class="hostContextIllustration2">
     *   <app-root>
     *     <div>
     *       <product-form class="hostContextIllustration1" nghost-upd-c123="">
     *         <label for="anInput" ngcontent-upd-c123="">Label:</label>
     *         <input type="text" id="anInput" ngcontent-upd-c123="">
     *       </product-form>
     *     </div>
     *   </app-root>
     * </body>
     *
     * Note that the host element itself (product-form) is assigned to the `.hostContextIllustration1` class
     * and also has the `nghost-upd-c123` attribute. This means that the
     * .hostContextIllustration1[nghost-upd-c123] input[ngcontent-upd-c123] rule will match any of its
     * input element children.
     *
     * Furthermore, the body element is assigned to the `.hostContextIllustration2` class which means
     * that the .hostContextIllustration2 [nghost-upd-c123] label[ngcontent-upd-c123] will match the
     * body element (assigned to the given class), will also match the product-form host element which
     * has the `nghost-upd-c123` attribute and finally will match the label within product-form that
     * has the `ngcontent-upd-c123` attribute.
     */
    ":host-context(.hostContextIllustration1) input { color: blueviolet; }",
    ":host-context(.hostContextIllustration2) label { background-color: coral; }"
  ]
})
export class ProductFormComponent {
  newProduct: Product = new Product();

  @Output()
  newProductCreated = new EventEmitter<Product>();

  submitForm(form: NgForm) {
    if (form.valid) {
      this.newProductCreated.emit(this.newProduct);
      this.newProduct = new Product();
      form.resetForm();
    }
  }
}
