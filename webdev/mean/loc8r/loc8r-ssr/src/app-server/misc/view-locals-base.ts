/**
 * Base interface defining view locals required by all views.
 */
export interface _ViewLocalsBaseI {
  title: string;
  pageHeader?: {
    title: string
  };
  activeMenuItem: number;
}
