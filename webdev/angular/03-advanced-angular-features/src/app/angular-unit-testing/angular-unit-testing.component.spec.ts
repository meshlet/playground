import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {
  InPlaceTemplateComponent,
  ServiceDepAndDataBindingComponent,
  ExtTmplHostListenerAndOutputPropComponent,
  InputPropComponent,
  AsyncOpsComponent
} from "./angular-unit-testing.component";
import { RepositoryModel } from "./repository.model";
import { ProductModel } from "./product.model";
import { By } from "@angular/platform-browser";
import {Component, DebugElement, Injectable, ViewChild} from "@angular/core";
import {Observable, Observer} from "rxjs";
import {RestDataSourceModel} from "./rest-data-source.model";

/**
 * The following is a mock class that will substitute the actual RepositoryModel
 * class used by some of the components under test. This is done in order to
 * abstract away the complexity of the RepositoryModel service, which should
 * be anyways tested in its own right (however testing services does not require
 * TestBed as service don't interact with Angular environment the same way
 * components and directives do).
 */
class RepositoryModelMock {
  private products: ProductModel[] = [
    { id: 1, name: "Soccer Ball", category: "Soccer", price: 19.50 },
    { id: 2, name: "Corner Flags", category: "Soccer", price: 34.95 },
    { id: 3, name: "Stadium", category: "Soccer", price: 79500 },
    { id: 4, name: "Thinking Cap", category: "Chess", price: 16 },
    { id: 5, name: "Unsteady Chair", category: "Chess", price: 29.95 },
    { id: 6, name: "Human Chess Board", category: "Chess", price: 75 }
  ];

  getProducts(): ProductModel[] {
    return this.products;
  }
}

/**
 * The following illustrates unit-testing Angular components using the
 * Jasmine test framework. Among other things, the TestBed class used
 * to simulate the Angular application environment is illustrated,
 * along with unit-testing data bindings, components with external
 * template, output and input properties properties as well as testing
 * with asynchronous operations.
 */
describe("illustrates Angular components unit-testing", () => {
  /**
   * Before each of the tests, configure the test module by specifying the
   * components to be tested, service providers required by those components
   * as well as modules that need to be imported. This configuration closely
   * matches that of the AngularUnitTestingModule defined in
   * angular-unit-testing.module.ts which makes sure that everything is in
   * order before components are instantiated by the tests.
   *
   * @note The reason beforeEach is used instead of beforeAll is that
   * Angular resets the testing module in its own beforeEach implementation.
   * Hence, configuring the testing module in beforeAll would affect the
   * first test and all the other tests would then work with the testing
   * module that has been reset to the default state.
   *
   * @note When unit-testing a component in a real-world app, it'd make sense to
   * create an instance of the component under testing before each test is
   * run using the beforeEach Jasmine function. This is not done here as
   * most of the tests use different components. It would look something like:
   *
   * beforeEach(() => {
   *  componentVariableVisibleWithinDescribe =
   *    TestBed.createComponent(InPlaceTemplateComponent).componentInstance;
   *  });
   */
  beforeEach(async () => {
    /**
     * Note that this is an async function so that Jasmine will wait for the
     * Promises returned by TestBed.configureTestingModule and TestBed.compilerComponents
     * to be resolved before executing the tests.
     *
     * @note Angular has fakeAsync and WaitForAsync functions that can be used to
     * wrap functions instead of using async...await or returning Promises. These
     * functions create a dedicate zone for the code to run in, making sure that all
     * async operations are done before zone exits. More info in:
     * https://angular.io/guide/testing-components-scenarios#component-with-async-service
     */
    await TestBed.configureTestingModule({
      declarations: [
        InPlaceTemplateComponent,
        ServiceDepAndDataBindingComponent,
        ExtTmplHostListenerAndOutputPropComponent
      ],
      providers: [
        /**
         * Replace the RepositoryModel with a mock repository.
         *
         * @note RepositoryModel service itself depends on the StaticDataSourceModel
         * service. However, as we're replacing it with RepositoryModelMock which
         * doesn't define this dependency, there's no need to define the service
         * provider for that service.
         */
        {
          provide: RepositoryModel, useValue: new RepositoryModelMock()
        }
      ]
    })
    /**
     * Compile any components with external templates, which will write the
     * HTML code as text into component's Javascript.
     */
      .compileComponents();
  });

  it("illustrates instantiating a component using the TestBed", () => {
    expect(TestBed.createComponent(InPlaceTemplateComponent).componentInstance)
      .toBeInstanceOf(InPlaceTemplateComponent);
  });

  /**
   * Nothing special in the test itself, important work has been done within the callback
   * passed to beforeEach method.
   */
  it("illustrates instantiating a component with a service dependency", () => {
    const component = TestBed.createComponent(ServiceDepAndDataBindingComponent).componentInstance;
    component.selectedCategory = "Chess";
    expect(component.getProducts().length).toBe(3);
    component.selectedCategory = "unknown category";
    expect(component.getProducts().length).toBe(0);
    component.selectedCategory = "Soccer";
    expect(component.getProducts().length).toBe(3);
  });

  it("tests data bindings", () => {
    const fixture = TestBed.createComponent(ServiceDepAndDataBindingComponent);
    const component = fixture.componentInstance;

    // `fixture.debugElement` is a representation of the component's host element.
    // It is used below to query the component's template for the first span
    // element. `By` function returns a search callback passed on to the DebugElement's
    // query method. `By.css` returns a function that uses CSS selector to match
    // elements (so By.css("span")) matches any HTML element whose name is span).
    const spanElem: HTMLSpanElement =
      fixture.debugElement.query(By.css("span")).nativeElement;

    // Change the selected category and run the change detection to let TestBed
    // re-evaluate the data binding expressions and update the component's template
    component.selectedCategory = "Chess";
    fixture.detectChanges();
    expect(spanElem.textContent).toEqual("3");

    component.selectedCategory = "unknown category";
    fixture.detectChanges();
    expect(spanElem.textContent).toEqual("0");

    component.selectedCategory = "Soccer";
    fixture.detectChanges();
    expect(spanElem.textContent).toEqual("3");
  });

  it("tests component's response to DOM events (possibly subscribed to via @HostListener)", () => {
    const fixture = TestBed.createComponent(ExtTmplHostListenerAndOutputPropComponent);
    const component = fixture.componentInstance;
    const hostDbgElem = fixture.debugElement;

     // Find the first DIV element within the template.
    const divHtmlElem = fixture.debugElement.query(By.css("div")).nativeElement as HTMLDivElement;

    // Check the value of the component's property and confirm that `text-primary`
    // class is not in the classList of the DIV element
    expect(component.mouseEnterOrLeave).toBe("");
    expect(divHtmlElem.classList.contains("text-primary")).toBeFalse();

    // Simulate the mouseenter event using the DebugElement.triggerEventHandler method
    // and run change detection to make sure that component property changes are reflected
    // in the template
    hostDbgElem.triggerEventHandler("mouseenter", new Event("mouseenter"));
    fixture.detectChanges();

    // Check the value of the component's property and confirm that `text-primary`
    // class is now in the classList of the DIV element
    expect(component.mouseEnterOrLeave).toBe("mouseenter");
    expect(divHtmlElem.classList.contains("text-primary")).toBeTrue();

    // Simulate the mouseleave event using the DebugElement.triggerEventHandler method
    // and run change detection to make sure that component property changes are reflected
    // in the template
    hostDbgElem.triggerEventHandler("mouseleave", new Event("mouseleave"));
    fixture.detectChanges();

    // Assert on the component's property value and presence of the text-primary class
    // in DIV's class list
    expect(component.mouseEnterOrLeave).toBe("mouseleave");
    expect(divHtmlElem.classList.contains("text-primary")).toBeFalse();
  });

  it("test (EventEmitter) output properties", () => {
    const fixture = TestBed.createComponent(ExtTmplHostListenerAndOutputPropComponent);
    const component = fixture.componentInstance;
    const hostDbgElem = fixture.debugElement;

    // Subscribe to the component's event emitter (output property)
    let lastMouseEvent = "";
    component.mouseEventChange.subscribe((value: string) => lastMouseEvent = value);

    // Simulate the mouseenter event using the DebugElement.triggerEventHandler method.
    // No need to run change detection because test isn't checking data bindings
    hostDbgElem.triggerEventHandler("mouseenter", new Event("mouseenter"));
    expect(lastMouseEvent).toBe("mouseenter");

    // Simulate the mouseleave event using the DebugElement.triggerEventHandler method
    hostDbgElem.triggerEventHandler("mouseleave", new Event("mouseleave"));
    expect(lastMouseEvent).toBe("mouseleave");
  });
});

/**
 * The following illustrates an approach to testing input properties in attributes.
 */
describe("testing component's input properties", () => {
  /**
   * The InputPropComponent that needs to be tested has an input property whose value
   * needs to be specified via its host element. To achieve this, a dummy parent
   * component is created whose template will instantiate the InputPropComponent
   * by using its host element and will initialize the input property with the
   * repository instance.
   */
  @Component({
    template: `
      <input-prop-component [repository]="repository"></input-prop-component>
    `
  })
  class ParentComponent {
    constructor(public repository: RepositoryModel) {
    }

    /**
     * This will return an instance of InputPropComponent bound to the
     * <input-prop-component> in the ParentComponent's template.
     */
    @ViewChild(InputPropComponent)
    // @ts-ignore
    componentUnderTest: InputPropComponent;
  }

  let fixture: ComponentFixture<ParentComponent>;
  let parentDbgElem: DebugElement;
  let componentUnderTest: InputPropComponent;

  /**
   * Initialize the testing module and obtain the instance of the component
   * to be tested (InputPropComponent).
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputPropComponent, ParentComponent],
      providers: [
        { provide: RepositoryModel, useValue: new RepositoryModelMock() }
      ]
    });

    fixture = TestBed.createComponent(ParentComponent);
    parentDbgElem = fixture.debugElement;

    // Change detection must be run for ViewChild query to complete and
    // result assigned to the property of the ParentComponent
    fixture.detectChanges();
    componentUnderTest = fixture.componentInstance.componentUnderTest;
    expect(componentUnderTest).toBeDefined();
  });

  it("illustrates testing component's input properties", () => {
    // Initially, the span element should have textContent set to 0 (no selected products)
    expect(parentDbgElem.query(By.css("span")).nativeElement.textContent).toEqual("0");

    // Set the category to Chess an re-run change detection
    componentUnderTest.selectedCategory = "Chess";
    fixture.detectChanges();

    // Assert that the span's content has been correctly updated
    expect(parentDbgElem.query(By.css("span")).nativeElement.textContent).toEqual("3");

    // Assert that the products in ParentComponent's repository instance
    // and InputPropComponent's repository instance are actually same objects
    expect(fixture.componentInstance.repository.getProducts().length)
      .toBe(componentUnderTest.repository?.getProducts().length || -1);

    expect(componentUnderTest.repository).toBeDefined();
    fixture.componentInstance.repository.getProducts().forEach((p: ProductModel, index: number) => {
      expect(p).toBe((componentUnderTest.repository as RepositoryModel).getProducts()[index]);
    });
  });
});

/**
 * The following illustrates testing asynchronous operations in
 * components.
 */
describe("testing async operations", () => {
  @Injectable()
  class RestDataSourceModelMock {
    private data: ProductModel[] = [
      { id: 1, name: "Soccer Ball", category: "Soccer", price: 19.50 },
      { id: 2, name: "Corner Flags", category: "Soccer", price: 34.95 },
      { id: 3, name: "Stadium", category: "Soccer", price: 79500 },
      { id: 4, name: "Thinking Cap", category: "Chess", price: 16 },
      { id: 5, name: "Unsteady Chair", category: "Chess", price: 29.95 },
      { id: 6, name: "Human Chess Board", category: "Chess", price: 75 }
    ];

    getData(): Observable<ProductModel[]> {
      /**
       * When Observable.subscribe is called with a callback (which is actually
       * an Observer), the subscribe callback passed to Observable constructor
       * is called and Observer is passed to it as argument.
       */
      return new Observable<ProductModel[]>(
        (observer: Observer<ProductModel[]>) => {
          setTimeout(() => observer.next(this.data), 500);
        });
    }
  }

  let fixture: ComponentFixture<AsyncOpsComponent>;
  let dbgElem: DebugElement;
  let componentUnderTest: AsyncOpsComponent;
  let dataSource = new RestDataSourceModelMock();

  /**
   * Initialize the testing module and obtain the instance of the component
   * to be tested (AsyncOpsComponent).
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsyncOpsComponent],
      providers: [
        { provide: RestDataSourceModel, useValue: dataSource }
      ]
    });

    fixture = TestBed.createComponent(AsyncOpsComponent);
    dbgElem = fixture.debugElement;
    componentUnderTest = fixture.componentInstance;
  });

  /**
   * Note the usage of the `fakeAsync` function. All the timers executed
   * in an fakeAsync zone are executed synchronously. Hence, even though
   * the timeout used by RestDataSourceModelMock is supposed to wait for
   * 500 ms, it will get executed as soon as `tick` function simulates the
   * passage of more than 500 ms of time (the tick function doesn't actually
   * wait for that amount of time).
   *
   * @note ComponentFixture.whenStable returns a promise that is resolved
   * when all changes have been fully processed (such as re-evaluating
   * data binding expressions in the template).
   */
  it('testing async operations in Angular components', fakeAsync(() => {
    tick(505);
    fixture.detectChanges();

    // Initially, the span element should have textContent set to 0 (no selected products)
    fixture.whenStable().then(() => {
      expect(dbgElem.query(By.css("span")).nativeElement.textContent).toEqual("0");
    });

    // Change the category and wait for the change to take effect
    componentUnderTest.setCategory("Soccer");
    tick(505);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(dbgElem.query(By.css("span")).nativeElement.textContent).toEqual("3");
    });
  }));
});
