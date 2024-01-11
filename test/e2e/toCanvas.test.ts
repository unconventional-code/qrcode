// @ts-nocheck
import { Canvas, createCanvas } from 'canvas';
import QRCode from '../../lib';
import * as Helpers from '../helpers';

describe('toCanvas - no promise available', () => {
	// Mock document object
	beforeEach(() => {
		Helpers.removeNativePromise();
		jest.spyOn(global.document, 'createElement').mockImplementation((el) => {
			if (el === 'canvas') {
				return createCanvas(200, 200);
			}
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
		Helpers.restoreNativePromise();
	});
	const canvasEl = createCanvas(200, 200);

	it('should throw if no arguments are provided', () => {
		expect(() => QRCode.toCanvas()).toThrow();
	});

	it('should throw if a callback is not provided', () => {
		expect(() => QRCode.toCanvas('some text')).toThrow();
	});

	it('should throw if a callback is not provided', () => {
		expect(() => QRCode.toCanvas(canvasEl, 'some text')).toThrow();
	});

	it('should throw if callback is not a function', () => {
		expect(() => QRCode.toCanvas(canvasEl, 'some text', {})).toThrow();
	});
});

describe('toCanvas', () => {
	// Mock document object
	beforeEach(() => {
		jest.spyOn(global.document, 'createElement').mockImplementation((el) => {
			if (el === 'canvas') {
				return createCanvas(200, 200);
			}
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should throw if no arguments are provided', () => {
		expect(() => QRCode.toCanvas()).toThrow();
	});

	it('should not throw an error', () => {
		QRCode.toCanvas('some text', function (err: any, canvasEl: any) {
			expect(err).toBeFalsy();
		});
	});

	it('should return a new canvas object', () => {
		QRCode.toCanvas('some text', function (err: any, canvasEl: any) {
			expect(canvasEl instanceof Canvas).toBe(true);
		});
	});

	it('should return a new canvas object (promise)', () => {
		QRCode.toCanvas('some text').then(function (canvasEl) {
			expect(canvasEl instanceof Canvas).toBe(true);
		});
	});

	it('should return a new canvas object (promise)', () => {
		QRCode.toCanvas('some text', {
			errorCorrectionLevel: 'H',
		}).then(function (canvasEl) {
			expect(canvasEl instanceof Canvas).toBe(true);
		});
	});
});

describe('toCanvas with specified canvas element', () => {
	beforeEach(() => {
		jest.spyOn(global.document, 'createElement').mockImplementation((el) => {
			if (el === 'canvas') {
				return createCanvas(200, 200);
			}
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const canvasEl = createCanvas(200, 200);

	it('should not throw an error', () => {
		QRCode.toCanvas(canvasEl, 'some text', function (err: any, canvasEl: any) {
			expect(err).toBeFalsy();
		});
	});

	it('should return a new canvas object', () => {
		QRCode.toCanvas(canvasEl, 'some text', function (err: any, canvasEl: any) {
			expect(canvasEl instanceof Canvas).toBe(true);
		});
	});

	it('should not throw an error', () => {
		QRCode.toCanvas(
			canvasEl,
			'some text',
			{
				errorCorrectionLevel: 'H',
			},
			function (err: any, canvasEl: any) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should return a new canvas object', () => {
		QRCode.toCanvas(
			canvasEl,
			'some text',
			{
				errorCorrectionLevel: 'H',
			},
			function (err: any, canvasEl: any) {
				expect(canvasEl instanceof Canvas).toBe(true);
			}
		);
	});

	it('should return a new canvas object (promise)', () => {
		QRCode.toCanvas(canvasEl, 'some text').then(function (canvasEl) {
			expect(canvasEl instanceof Canvas).toBe(true);
		});
	});

	it('should return a new canvas object (promise)', () => {
		QRCode.toCanvas(canvasEl, 'some text', {
			errorCorrectionLevel: 'H',
		}).then(function (canvasEl) {
			expect(canvasEl instanceof Canvas).toBe(true);
		});
	});
});
