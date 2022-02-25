import { Request, Response } from 'express';
import { _ViewLocalsBaseI as ViewLocalsBaseI } from '../misc/view-locals-base';
import { _renderView as renderView } from '../misc/render-view';

/**
 * Contains controllers for views that don't fit into any other group.
 */

/** Defines what view locals are neccessary to render the about page. */
interface AboutPageLocalsI extends ViewLocalsBaseI {
  paragraphs: Array<string>;
}

/**
 * About page controller.
 */
export function _about(_: Request, res: Response): void {
  const viewLocals: AboutPageLocalsI = {
    title: 'About Loc8r',
    activeMenuItem: 1,
    pageHeader: {
      title: 'About'
    },
    paragraphs: [
      'Loc8r was created to help people find places to sit down and get a bit of work done.',

      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend fermentum nibh, et' +
      ' ultrices ex elementum eget. Integer finibus molestie ex, eu lobortis urna maximus sed. Ut' +
      ' non ex vitae arcu mattis lobortis. Phasellus sapien tortor, commodo a leo ac, pellentesque' +
      ' pellentesque ante. Aenean pretium turpis facilisis dui sodales, vitae vehicula sapien commodo.' +
      ' Integer id congue justo. Vestibulum pharetra pulvinar tellus at dictum. Phasellus augue nisi,' +
      ' volutpat a nibh non, porta finibus risus.',

      'Proin maximus, quam at dignissim rhoncus, purus ligula placerat ligula, in posuere justo urna' +
      ' a quam. Proin eu quam et velit lacinia accumsan eu sed neque. In hac habitasse platea dictumst.' +
      ' Morbi lacinia diam porta, mollis lectus in, viverra neque. Sed sed venenatis sem. Donec lorem nisi,' +
      ' blandit volutpat libero eu, gravida rhoncus eros. Phasellus eu purus ullamcorper, iaculis diam sed,' +
      ' fringilla massa. Donec imperdiet mollis ante a venenatis. Vestibulum pellentesque commodo dignissim.' +
      ' Fusce varius malesuada turpis, ac fringilla ligula facilisis et.',

      'Etiam iaculis nisl eu libero imperdiet tincidunt. Fusce mollis dapibus fermentum. Aenean nec accumsan' +
      ' est, eget accumsan urna. Nam in velit malesuada ligula gravida dignissim rhoncus sed nibh. Donec ornare' +
      ' lectus vel fermentum blandit. Nullam eget odio gravida, sagittis risus vitae, scelerisque leo. Praesent' +
      ' cursus, dolor eget malesuada mollis, tellus ligula ornare arcu, at condimentum ipsum augue eget nunc.' +
      ' Proin mauris odio, egestas vitae diam a, lacinia pellentesque mauris. Vivamus libero leo, luctus eget' +
      ' ultricies et, iaculis non ante.'
    ]
  };
  renderView(res, 'text', viewLocals);
}

/**
 * The error page controller.
 *
 * @note The error message is stored in session flash and read-in/
 * made available to the view automatically.
 */
export function _error(_: Request, res: Response): void {
  const viewLocals: ViewLocalsBaseI = {
    title: 'Loc8r',
    activeMenuItem: -1
  };
  renderView(res, 'text', viewLocals);
}
