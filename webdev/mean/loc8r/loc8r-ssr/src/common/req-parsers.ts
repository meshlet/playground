import * as bodyParser from 'body-parser';

/**
 * @file Exports different HTTP request parsers. These parsers to be
 * used as Express middleware functions.
 */

/**
 * Configure a parser for URL encoded forms.
 */
export const _urlEncodedFormParser = bodyParser.urlencoded({
  extended: true
});

/**
 * Create a JSON parser.
 */
export const _jsonParser = bodyParser.json();
