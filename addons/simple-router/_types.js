/**
 * @typedef {{
 *  c: Map<string,RTNode>,
 *  h: (Function|null),
 *  p: (string|null),
 * }} RTNode
 */
export var RTNode;

/**
 * @typedef {{
 *  handler: Function,
 *  params: Object<string,string>,
 *  url: URL,
 * }} Match
 */
export var Match;

/**
 * @typedef {{
 *  pattern: Object,
 *  handler: Function,
 *  score: Array<number>,
 * }} Route
 */
export var Route;
