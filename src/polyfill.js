// IE11 支持
import 'core-js/features/promise';
import 'core-js/features/symbol';
import 'core-js/es/object/assign';
// import 'core-js/es/map';
import 'core-js/es/array/from';
import 'core-js/es/array/find';
import 'core-js/es/array/includes';
import 'core-js/es/string/includes';
import 'core-js/es/string/starts-with';
import 'core-js/es/string/ends-with';
import 'core-js/es/array/find-index';
import 'core-js/es/number/is-nan';
import 'core-js/features/dom-collections/for-each';
import 'whatwg-fetch';
import AbortController from 'abort-controller/dist/abort-controller.umd';

window.AbortController = AbortController;
