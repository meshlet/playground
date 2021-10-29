import { Component } from "@angular/core";
import { RepositoryModel} from "./repository.model";
import {animate, group, state, style, transition, trigger} from "@angular/animations";

/**
 * The following components defines several Angular animation triggers with a
 * set of states and transitions applied when element goes from one state to the
 * next. The `state` function creates a new state and `style` function creates
 * a style map that will be applied to an element once it enters the given
 * state. The `transition` function creates a transition that defines how
 * the element's style changes when it transitions from one state to the
 * next (i.e. is the change gradual/animated, or is it sudden/immediate).
 * The transition type is indicated with an array, where "state1 => state2"
 * means that this transition defines what happens when element transitions
 * from state1 to state2. "state1 <=> state2" means that given transition
 * is applied both when element transition from state1 to state2 and back
 * from state2 to state1. The string is the first argument to the `transition`
 * function (i.e. transition("state1 => state2",...). The second argument
 * to the `transition` function defines how the transition happens (hence
 * is it animated or immediate) and `animate` function is used to indicate
 * to Angular that transition from one state to the other and the corresponding
 * element style change should be animated. The following example illustrate
 * how the animation system works.
 *
 * Let's say that we've defined a following trigger with two states both of which
 * define different font sizes and background colors as well as one bidirectional
 * transition that is applied whenever an element transitions between these two
 * states. The transition is animated with duration of 1000 ms.
 *
 * const SimpleTrigger = trigger("simpleTrigger", [
 *   state("state1", style({
 *     fontSize: "20px";
 *     backgroundColor: "green";
 *   }
 *   state("state2", style({
 *     fontSize: "10px";
 *     backgroundColor: "blue";
 *   }
 *   transition("state1 <=> state2", animate("1000ms"));
 * ]);
 *
 * and the following component whose template makes use of the trigger:
 *
 * @Component({
 *   selector: "simple-component",
 *   // Animations triggers applied to the component (used in component's template)
 *   // must be included in the config object passed to the @Component decorator.
 *   animations: [SimpleTrigger],
 *   template: `
 *     <button type="button" (click)=currentState = currentState === "state1" ? "state2" : "state1">Toggle paragraph's state</button>
 *     <p [@simpleTrigger]="currentState>
 *       This is a simple paragraph.
 *     </p>
 *   `
 * }
 * export class SimpleComponent {
 *   public currentState: string = "state1";
 * }
 *
 * Note the [@simpleTrigger]="" syntax that tells Angular this is a special
 * animation data binding. Also note that `simpleTrigger` is the name of the
 * trigger defined earlier (first argument to the `trigger` function). The
 * data binding target (@simpleTrigger) tells Angular that it is the SimpleTrigger
 * trigger instance that defines CSS styles for the element's state. Hence,
 * if `currentState = state1` Angular applies the CSS styles from the state1
 * state from SimpleTrigger to the <p> element. If user than clicks the button
 * which toggles the value of `currentState` to `state2`, Angular will re-evaluate
 * the [@simpleTrigger]="currentState" binding expression and find out that there
 * has been a transition from state1 to state2. Because of the transition defined
 * in the SimpleTrigger trigger, <p> element's style will gradually change from
 * { fontSize: "20px"; backgroundColor: "green"; } to
 * { fontSize: "10px"; backgroundColor: "blue"; }. If the user then clicks button
 * again, the transition will be applied in the other direction because the
 * transition type is "state1 <=> state2" meaning it applies both when state1
 * changes to state2 and the other way around.
 *
 * @note The animation/style transitions are implemented with browser's built-in
 * Web Animation API (not the CSS animations).
 *
 * @note Defining triggers in-place like done here is not a recommended
 * approach if triggers are complex or there are many of them. It is better
 * to define them in their own .ts source and export the trigger instance
 * which can than be registered in the component(s) that uses them.
 *
 * @note More info on Angular's animation system can be found here:
 * https://angular.io/guide/animations (check other pages in the Animation
 * menu).
 */

/**
 * See usingArrayOfStyleObjects trigger below.
 */
const commonStyleGroup = {
  backgroundColor: "red",
  width: "50px",
  height: "50px"
};

@Component({
  selector: "animation",
  templateUrl: "animation.component.html",
  animations: [
    /**
     * The following trigger defines two states, rowSelected representing a row whose
     * product's category matches the one selected by the user. Conversely, rowNotSelected
     * state represents a row whose column doesn't match the selected category.
     *
     * @note There's not state for the case where user doesn't select any category. This
     * is handled in the `rowHighlightAsteriskAndVoidState` trigger.
     */
    trigger("rowHighlight", [
      state("rowSelected", style({
        backgroundColor: "darkgreen",
        color: "white",
        fontSize: "20px"
      })),
      state("rowNotSelected", style({
        backgroundColor: "lightslategray",
        color: "white",
        fontSize: "12px"
      })),

      /**
       * Transition from rowSelected to rowNotSelected is animated with duration of 200 ms.
       * The transition in the other way is also animated with duration of 400 ms.
       */
      transition("rowSelected => rowNotSelected", animate("0.2s")),
      transition("rowNotSelected => rowSelected", animate("400ms"))
    ]),

    /**
     * The following trigger is similar to the `rowHighlight`, with the addition of
     * `void` and `*` built-in states that are described below. This trigger will
     * animate the addition and removal of table rows as well as transition of rows
     * when user selects a category or clears the selected category (so that there's
     * no current selected category).
     */
    trigger("rowHighlightAsteriskAndVoidState", [
      /**
       * Void state is applied by Angular to any element that is not included in the
       * view, for example because element uses the *ngIf directive whose expression
       * evaluates to false. Basically, all elements are initialized into the void
       * state (which changes once view is processed) and transitioned into the void
       * state once elements are removed from the view (i.e. removing product from
       * the table removes the <tr> element which is then put into void state).
       *
       * @note The opacity is set to 0 in this state so that adding element to the
       * DOM (leaving void state) will animate fade-in with opacity going from 0
       * to its final value. Conversely, removing element from the DOM (entering
       * the void state) will animate fade-out with opacity changing to 0 before
       * the element is entirely removed from DOM.
       */
      state("void", style({
        opacity: 0
      })),

      /**
       * Asterisk (*) state is applied by Angular to any element which is not assigned
       * to any other state defined by the trigger. In this case, we're using this
       * default state to animate transition in and out of two other states. Note that
       * no additional styles are applied in the default state - this means that element
       * will keep whatever styles it had (defined by the Bootstrap classes element
       * belongs to).
       *
       * @note The `*` state also includes the `void` state.
       */
      state("*", style({})),

      state("rowSelected", style({
        backgroundColor: "darkgreen",
        color: "white",
        fontSize: "20px"
      })),
      state("rowNotSelected", style({
        backgroundColor: "lightslategray",
        color: "white",
        fontSize: "12px"
      })),

      /**
       * The order in which transitions are defined is important. If multiple transitions
       * match a give state transition, Angular will apply the one that was defined first
       * within the trigger. Take for example the "void <=> *" and "* <=> rowSelected"
       * transitions below. Assume that element is in the "rowSelected" state and then
       * gets removed from the DOM which means its state will be set to "void". Both of
       * the mentioned transitions match the state transition: the "void <=> *" matches
       * because "*" matches the "rowSelected" state, and "void <=> *" matches for the
       * same reason. However, because "void <=> *" is defined first, it is applied by
       * Angular.
       *
       * @note The "void <=> *" transition defines the fade-in and fade-out animations
       * when elements are added and removed from DOM respectively.
       */
      transition("void <=> *", animate("1s")),
      transition("rowSelected => rowNotSelected", animate("0.2s")),
      transition("rowNotSelected => rowSelected", animate("400ms")),
      transition("* <=> rowSelected", animate("400ms")),
      transition("* <=> rowNotSelected", animate("200ms"))
    ]),

    /**
     * Almost identical to the `rowHighlightAsteriskAndVoidState`, adding the initial
     * delay to the "rowNotSelected => rowSelected" animation making sure that
     * "rowSelected => rowNotSelected" animation completes before the other one
     * begins.
     */
    trigger("rowHighlightInitialDelay", [
      state("void", style({
        opacity: 0
      })),
      state("*", style({})),
      state("rowSelected", style({
        backgroundColor: "darkgreen",
        color: "white",
        fontSize: "20px"
      })),
      state("rowNotSelected", style({
        backgroundColor: "lightslategray",
        color: "white",
        fontSize: "12px"
      })),
      transition("void <=> *", animate("1s")),
      transition("rowSelected => rowNotSelected", animate("0.2s")),

      /**
       * The "0.2s" passed to the animate function is the initial delay before the
       * animation can start. Note that the animation duration for "rowSelected => rowNotSelected"
       * transition is also 0.2s, which means that that transition will complete first
       * at which which point the "rowNotSelected => rowSelected" transition starts.
       */
      transition("rowNotSelected => rowSelected", animate("400ms 0.2s")),
      transition("* <=> rowSelected", animate("400ms")),
      transition("* <=> rowNotSelected", animate("200ms"))
    ]),

    /**
     * The following illustrates the timing functions that can be used to control
     * the calculation of intermediate values of CSS properties during transitions.
     * The available functions are:
     *
     * - linear: the rate of change remains the same throughout the transition
     * - ease-in: changes are initially small but increase over time resulting in
     *   animation that starts slowly but speeds up later
     * - ease-out: changes are initially large but decrease over time resulting in
     *   animation that starts quickly but slows down later
     * - ease-in-out: starts fast, slows down around middle and gets fast again
     * - cubic-bezier: calculates intermediate values using a Bezier curve
     *
     * @note The timing function is provides as part of the first parameter of the
     * animate function, after both the duration and initial delay if used.
     *
     * @note The same state can have multiple names as illustrated below.
     */
    trigger("timingFunctions", [
      state("initial_1,initial_2,initial_3,initial_4,initial_5", style({
        left: 0,
      })),
      state("final_1,final_2,final_3,final_4,final_5", style({
        left: "calc(100% - 80px)"
      })),
      transition("initial_1 <=> final_1", animate("3s")), // Linear is default
      transition("initial_2 <=> final_2", animate("3s ease-in")),
      transition("initial_3 <=> final_3", animate("3s ease-out")),
      transition("initial_4 <=> final_4", animate("3s ease-in-out")),
      transition("initial_5 <=> final_5", animate("3s cubic-bezier(.17,.67,.83,.67)"))
    ]),

    /**
     * The following illustrates passing a style group as the second argument
     * to `animate` function. This essentially adds a new state to the transition
     * between the two specified states (in this case initial and final), hence
     * property values will first change towards the values specified in this
     * style group and these changes are animated. After that, the values are
     * changed to styles specified in the target state without animation making
     * the last part of transition abrupt. This can be solved by passing an
     * array of animations to the `transition` function as done in the
     * `transitionWithArrayOfAnimations` trigger.
     */
    trigger("animateCallWithStyleGroup", [
      state("initial", style({
        left: 0,
        width: "50px"
      })),
      state("final", style({
        left: "calc(50% - 50px)",
        width: "50px"
      })),
      transition(
        "initial <=> final",
        animate("3s", style({
          left: "calc(100% - 100px)",
          width: "100px"
        })))
    ]),

    /**
     * The following trigger illustrates passing an array of animations to the
     * `transition` function. When the given transition triggers, Angular will
     * execute all the provided animations in sequence one after the other.
     * Furthermore, if the last animation does not define a style group, it
     * will transition the values towards those specified by the target state
     * (i.e. if the current transition is "initial => final", the last animation
     * that doesn't define a style group will transition the values to those
     * defined by the "final" state).
     */
    trigger("transitionWithArrayOfAnimations", [
      state("initial", style({
        left: 0,
        width: "50px"
      })),
      state("final", style({
        left: "calc(50% - 50px)",
        width: "50px"
      })),
      transition(
        "initial => final", [
          animate("3s", style({
            left: "calc(100% - 100px)",
            width: "100px"
          })),
          animate("2s", style({
            left: 0,
            width: "80px"
          })),
          animate("800ms")
        ]),
      transition("final => initial", [
        animate("2s", style({
          left: 0,
          width: "50px"
        })),
        animate("3s", style({
          left: "calc(100% - 100px)",
          width: "100px"
        })),
        animate("1.5s")
      ])
    ]),

    /**
     * The following illustrates using the `group` function to create animations
     * that are run in parallel by Angular. The animations in the same group are
     * all started at the same time and run independently of each other. They
     * may have different durations, meaning they can complete at different times.
     * This is illustrated by animating the `left` and `backgroundColor` property
     * with two parallel animations, so that backgroundColor animation will take
     * longer to complete.
     *
     * Note, however, that Angular will wait for all the animations in the group to
     * complete before moving on to the next sequential animation (which in this
     * animate("500ms") which transitions the values to the target state).
     */
    trigger("parallelAnimations", [
      state("initial", style({
        left: 0,
        backgroundColor: "red",
        width: "50px"
      })),
      state("final", style({
        left: "calc(100% - 50px)",
        backgroundColor: "green",
        width: "50px"
      })),
      transition("initial <=> final", [
        group([
          animate("1s", style({
            left: "calc(50% - 50px)",
            width: "50px"
          })),
          animate("2.5s", style({
            backgroundColor: "yellow",
          }))
        ]),
        animate("500ms")
      ])
    ]),

    /**
     * The following illustrates passing multiple styles to the `style` function.
     * Angular processes these style objects sequentially, meaning that if the
     * same property is reassigned to a different value in a later object it will
     * override the previous value as illustrated below with the backgroundColor.
     *
     * @note This functionality can be used to specify common styles that are
     * then used throughout the application. In specific cases where properties
     * need to be updated, this can be done by providing a new style object
     * with those properties set to required values in the array passed to `style`
     * function.
     */
    trigger("usingArrayOfStyleObjects", [
      state("initial", style([
        commonStyleGroup,
        // Even though `commonStyleGroup` defines bg color as red, it is overriden below
        // to yellow
        {
          backgroundColor: "yellow"
        }
      ])),
      state("final", style([
        // Even though `commonStyleGroup` defines width as 50px, it is overriden below
        // to 100px
        commonStyleGroup,
        {
          width: "100px"
        }
      ])),
      transition("initial <=> final", animate("500ms"))
    ]),

    /**
     * The following illustrates using CSS transform property to animate elements.
     * Only translateX, scale and rotate transformation functions is illustrated bellow,
     * but many are available in the CSS language itself.
     */
    trigger("animationUsingTransformProperty", [
      state("initial", style([
        commonStyleGroup,
        {
          width: "300px",
        }
      ])),
      state("final", style([
        commonStyleGroup,
        {
          width: "300px",
          transform: "translateX(50%) scale(1.5) rotate(45deg)"
        }
      ])),
      transition("initial <=> final", animate("1000ms"))
    ])
  ]
})
export class AnimationComponent {
  public selectedCategory1 = "";
  public selectedCategory2 = "";
  public selectedCategory3 = "";
  public timingFunctionsState = "initial";
  public animateCallWithStyleGroupState = "initial";
  public transitionWithArrayOfAnimationsState = "initial";
  public parallelAnimationsState = "initial";
  public usingArrayOfStyleObjectsState = "initial";
  public animationUsingTransformPropertyState = "initial";
  public repository = new RepositoryModel();

  getCategories(): string[] {
    const categories: string[] = [];
    for (let p of this.repository.getProducts()) {
      if (categories.findIndex((c: string) => c === p.category) === -1) {
        categories.push(p.category);
      }
    }
    return categories;
  }

  deleteProduct(id: number) {
    this.repository.deleteProduct(id);
  }

  /**
   * If no category has been selected return an empty string, otherwise return
   * either rowSelected or rowNotSelected depending on whether the selected
   * category matches that of the product whose table row is currently being
   * processed.
   */
  getRowAnimationState(category: string, categorySelectedByUser: string): string {
    if (categorySelectedByUser === "") {
      return "";
    }

    return categorySelectedByUser === category ? "rowSelected" : "rowNotSelected";
  }
}
