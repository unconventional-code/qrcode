import { JSDOM } from 'jsdom';
const dom = new JSDOM();
global.document = dom.window.document;
// @ts-ignore
global.window = dom.window;

export {};
