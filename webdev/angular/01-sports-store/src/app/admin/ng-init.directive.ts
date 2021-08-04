import {Directive, Input, OnInit } from '@angular/core';

/**
 * A directive that emulates the functionality of AngularJS ng-init. It can be
 * used to invoke a function once, at component init time. The directive allows
 * specifying 'this' argument as well as the arbitrary number of parameters to
 * the function (passed as an array).
 */
@Directive({
  selector: '[appNgInit]'
})
export class NgInitDirective implements OnInit {
  @Input() appNgInit: any;
  @Input('thisArg') thisArg: any = null;
  @Input('args') args: any[] = [];

  ngOnInit(): void {
    if (this.appNgInit) {
      this.appNgInit.apply(this.thisArg, this.args);
    }
  }
}
