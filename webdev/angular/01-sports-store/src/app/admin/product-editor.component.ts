/**
 * Component for the template that allows an admin to create new
 * or edit existing product.
 */
import { Component } from '@angular/core';
import {ProductRepository} from '../model/product.repository';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../model/product.model';
import {NgForm} from '@angular/forms';

@Component({
  templateUrl: 'product-editor.component.html'
})
export class ProductEditorComponent {
  editing = false;
  product = new Product();

  constructor(
    private repository: ProductRepository,
    private router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.editing = activatedRoute.snapshot.params.mode === 'edit';
    if (this.editing) {
      // Object.assign is used instead of plain assignment as we're
      // assuming that this.product always points to a Product object.
      // And if we attempt to assign null to this.product, Object.assign
      // will essentially be a NOP
      Object.assign(
        this.product,
        this.repository.getProduct(Number(activatedRoute.snapshot.params.id)));
    }
  }

  public createOrUpdate(form: NgForm): void {
    if (form.valid) {
      this.repository.saveProduct(this.product);
      this.router.navigateByUrl('/admin/products');
    }
  }
}
