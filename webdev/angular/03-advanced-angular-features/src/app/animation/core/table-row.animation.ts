import { animate, state, style, transition, trigger } from "@angular/animations";

/**
 * The following defines a Angular animation trigger with a set of states
 * and transitions applied when element goes from one state to the next.
 *  The `state` function creates a new state and `style` function creates
 *  a style map that will be applied to an element once it enters the given
 *  state. The `transition` function creates a transition that defines how
 *  the element's style changes when it transitions from one state to the
 *  next (i.e. is the change gradual/animated, or is it sudden/immediate).
 *  The transition type is indicated with an array, where "state1 => state2"
 *  means that this transition defines what happens when element transitions
 *  from state1 to state2. "state1 <=> state2" means that given transition
 *  is applied both when element transition from state1 to state2 and back
 *  from state2 to state1. The string is the first argument to the `transition`
 *  function (i.e. transition("state1 => state2",...). The second argument
 *  to the `transition` function defines how the transition happens (hence
 *  is it animated or immediate) and `animate` function is used to indicate
 *  to Angular that transition from one state to the other and the corresponding
 *  element style change should be animated. The following example illustrate
 *  how the animation system works.
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
 * CSS animation/transition functionality.
 *
 * @note More info on Angular's animation system can be found here:
 * https://angular.io/guide/animations (check other pages in the Animation
 * menu).
 */
export const RowHighlightTrigger = trigger("rowHighlight", [
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
  transition("* <=> rowSelected", animate("400ms")),
  transition("* <=> rowNotSelected", animate("200ms")),
  transition("rowSelected => rowNotSelected", animate("0.2s")),
  transition("rowNotSelected => rowSelected", animate("400ms"))
]);
