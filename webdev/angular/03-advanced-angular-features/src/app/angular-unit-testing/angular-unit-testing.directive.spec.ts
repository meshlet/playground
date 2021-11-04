import {ComponentFixture, TestBed} from "@angular/core/testing";
import { SimpleAttributeDirective } from "./angular-unit-testing.directive";
import {Component, ViewChild} from "@angular/core";
import {By} from "@angular/platform-browser";

describe("Testing directives", () => {
  @Component({
    selector: "test-component",
    template: `
      <div>
          <span [simple-attr-dir]="cssClass">Test Content</span>
      </div>
    `
  })
  class TestComponent {
    public cssClass = "initial";

    @ViewChild(SimpleAttributeDirective)
    // @ts-ignore
    directiveUnderTest: SimpleAttributeDirective;
  }

  let fixture: ComponentFixture<TestComponent>;
  let directiveUnderTest: SimpleAttributeDirective;
  let spanHtmlElem: HTMLSpanElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, SimpleAttributeDirective]
    });
    fixture = TestBed.createComponent(TestComponent);

    // Must run change detection for the view child query to complete
    fixture.detectChanges();
    directiveUnderTest = fixture.componentInstance.directiveUnderTest;
    spanHtmlElem = fixture.debugElement.query(By.css("span")).nativeElement;

    // Make sure that directive and span element are defined
    expect(directiveUnderTest).toBeDefined();
    expect(spanHtmlElem).toBeDefined();
  });

  it("illustrates testing Angular directives", () => {
    // Assert that directive's bgClass input property has expected value as
    // well as that span element to which the directive is applied has the
    // expected class that should've been set by the directive
    expect(directiveUnderTest.bgClass).toBe("initial");
    expect(spanHtmlElem.className).toBe("initial");

    // Change the class via the TestComponent, run change detection and
    // assert that directive has updated span element's class
    fixture.componentInstance.cssClass = "bg-primary";
    fixture.detectChanges();
    expect(directiveUnderTest.bgClass).toBe("bg-primary");
    expect(spanHtmlElem.className).toBe("bg-primary");
  });
});
