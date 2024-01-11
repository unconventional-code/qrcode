// @ts-nocheck
import fs from 'fs';
import path from 'path';
import QRCode from '../../lib';
import browser from '../../lib/browser';
import Helpers from '../helpers';

describe('toString - no promise available', () => {
	beforeAll(() => {
		Helpers.removeNativePromise();
	});

	afterAll(() => {
		Helpers.restoreNativePromise();
	});

	it('should throw if text is not provided', () => {
		expect(() => QRCode.toString()).toThrow();
	});

	it('should throw if a callback is not provided', () => {
		expect(() => QRCode.toString('some text')).toThrow();
	});

	it('should throw if a callback is not a function', () => {
		expect(() => QRCode.toString('some text', {})).toThrow();
	});

	it('should throw if text is not provided (browser)', () => {
		expect(() => QRCode.toString()).toThrow();
	});

	it('should throw if a callback is not provided (browser)', () => {
		expect(() => browser.toString('some text')).toThrow();
	});

	it('should throw if a callback is not a function (browser)', () => {
		expect(() => browser.toString('some text', {})).toThrow();
	});
});

describe('toString', () => {
	it('should throw if text is not provided', () => {
		expect(() => QRCode.toString()).toThrow();
	});

	it('should not throw an error', () => {
		QRCode.toString('some text', function (err, string) {
			expect(err).toBeFalsy();
		});
	});

	it('should return a string', () => {
		QRCode.toString('some text', function (err, string) {
			expect(typeof string).toBe('string');
		});
	});

	it('should return a promise', () => {
		expect(typeof QRCode.toString('some text').then).toBe('function');
	});

	it('should return a string (promise)', () => {
		QRCode.toString('some text', { errorCorrectionLevel: 'L' }).then(function (string) {
			expect(typeof string).toBe('string');
		});
	});
});

describe('toString (browser)', () => {
	it('should throw if text is not provided', () => {
		expect(() => browser.toString()).toThrow();
	});

	it('should not throw an error (browser)', () => {
		browser.toString('some text', function (err, str) {
			expect(err).toBeFalsy();
		});
	});

	it('should return a string (browser)', () => {
		browser.toString('some text', function (err, str) {
			expect(typeof str).toBe('string');
		});
	});

	it('should return a promise (browser)', () => {
		expect(typeof browser.toString('some text').then).toBe('function');
	});

	it('should return a string (browser promise)', () => {
		browser.toString('some text', { errorCorrectionLevel: 'L' }).then(function (str) {
			expect(typeof str).toBe('string');
		});
	});
});

describe('toString svg', () => {
	const file = path.join(__dirname, '/svgtag.expected.out');
	it('should return an error', () => {
		QRCode.toString(
			'http://www.google.com',
			{
				version: 1, // force version=1 to trigger an error
				errorCorrectionLevel: 'H',
				type: 'svg',
			},
			function (err, code) {
				expect(err).toBeTruthy();
			}
		);
	});

	it('should not return a string', () => {
		QRCode.toString(
			'http://www.google.com',
			{
				version: 1, // force version=1 to trigger an error
				errorCorrectionLevel: 'H',
				type: 'svg',
			},
			function (err, code) {
				expect(code).toBeUndefined();
			}
		);
	});

	const expectedSvg = fs.readFileSync(file, 'utf8');

	it('should not return an error', () => {
		QRCode.toString(
			'http://www.google.com',
			{
				errorCorrectionLevel: 'H',
				type: 'svg',
			},
			function (err, code) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should output a valid svg', () => {
		QRCode.toString(
			'http://www.google.com',
			{
				errorCorrectionLevel: 'H',
				type: 'svg',
			},
			function (err, code) {
				expect(code).toEqual(expectedSvg);
			}
		);
	});

	it('should return an error (promise)', () => {
		QRCode.toString('http://www.google.com', {
			version: 1, // force version=1 to trigger an error
			errorCorrectionLevel: 'H',
			type: 'svg',
		}).catch(function (err) {
			expect(err).toBeTruthy();
		});
	});

	it('should output a valid svg (promise)', () => {
		QRCode.toString('http://www.google.com', {
			errorCorrectionLevel: 'H',
			type: 'svg',
		}).then(function (code) {
			expect(code).toEqual(expectedSvg);
		});
	});
});

describe('toString scaled svg', () => {
	const file = path.join(__dirname, '/svgtag.scaled.expected.out');

	const expectedSvg = fs.readFileSync(file, 'utf8');

	it('should output a valid svg', () => {
		QRCode.toString(
			'http://www.google.com',
			{
				errorCorrectionLevel: 'H',
				type: 'svg',
				scale: 1,
			},
			function (err, code) {
				expect(err).toBeFalsy();
				expect(code).toEqual(expectedSvg);
			}
		);
	});
});

describe('toString browser svg', () => {
	const file = path.join(__dirname, '/svgtag.expected.out');

	const expectedSvg = fs.readFileSync(file, 'utf8');

	it('should output a valid svg', () => {
		browser.toString(
			'http://www.google.com',
			{
				errorCorrectionLevel: 'H',
				type: 'svg',
			},
			function (err, code) {
				expect(err).toBeFalsy();
				expect(code).toEqual(expectedSvg);
			}
		);
	});

	it('should output a valid svg (promise)', () => {
		browser
			.toString('http://www.google.com', {
				errorCorrectionLevel: 'H',
				type: 'svg',
			})
			.then(function (code) {
				expect(code).toEqual(expectedSvg);
			});
	});
});

describe('toString utf8', () => {
	const expectedUtf8 = [
		'                                 ',
		'                                 ',
		'    █▀▀▀▀▀█ █ ▄█  ▀ █ █▀▀▀▀▀█    ',
		'    █ ███ █ ▀█▄▀▄█ ▀▄ █ ███ █    ',
		'    █ ▀▀▀ █ ▀▄ ▄ ▄▀ █ █ ▀▀▀ █    ',
		'    ▀▀▀▀▀▀▀ ▀ ▀ █▄▀ █ ▀▀▀▀▀▀▀    ',
		'    ▀▄ ▀▀▀▀█▀▀█▄ ▄█▄▀█ ▄█▄██▀    ',
		'    █▄ ▄▀▀▀▄▄█ █▀▀▄█▀ ▀█ █▄▄█    ',
		'    █▄ ▄█▄▀█▄▄  ▀ ▄██▀▀ ▄  ▄▀    ',
		'    █▀▄▄▄▄▀▀█▀▀█▀▀▀█ ▀ ▄█▀█▀█    ',
		'    ▀ ▀▀▀▀▀▀███▄▄▄▀ █▀▀▀█ ▀█     ',
		'    █▀▀▀▀▀█ █▀█▀▄ ▄▄█ ▀ █▀ ▄█    ',
		'    █ ███ █ █ █ ▀▀██▀███▀█ ██    ',
		'    █ ▀▀▀ █  █▀ ▀ █ ▀▀▄██ ███    ',
		'    ▀▀▀▀▀▀▀ ▀▀▀  ▀▀ ▀    ▀  ▀    ',
		'                                 ',
		'                                 ',
	].join('\n');

	it('should return an error', () => {
		QRCode.toString(
			'http://www.google.com',
			{
				version: 1, // force version=1 to trigger an error
				errorCorrectionLevel: 'H',
				type: 'utf8',
			},
			function (err, code) {
				expect(err).toBeTruthy();
				expect(code).toBeUndefined();
			}
		);
	});

	it('should output a valid symbol', () => {
		QRCode.toString(
			'http://www.google.com',
			{
				errorCorrectionLevel: 'M',
				type: 'utf8',
			},
			function (err, code) {
				expect(err).toBeFalsy();
				expect(code).toEqual(expectedUtf8);
			}
		);
	});

	it('should output a valid symbol with default options', () => {
		QRCode.toString('http://www.google.com', function (err, code) {
			expect(err).toBeFalsy();
			expect(code).toEqual(expectedUtf8);
		});
	});

	it('should return an error (promise)', () => {
		QRCode.toString('http://www.google.com', {
			version: 1, // force version=1 to trigger an error
			errorCorrectionLevel: 'H',
			type: 'utf8',
		}).catch(function (err) {
			expect(err).toBeTruthy();
		});
	});

	it('should output a valid symbol (promise)', () => {
		QRCode.toString('http://www.google.com', {
			errorCorrectionLevel: 'M',
			type: 'utf8',
		}).then(function (code) {
			expect(code).toEqual(expectedUtf8);
		});
	});

	it('should output a valid symbol with default options (promise)', () => {
		QRCode.toString('http://www.google.com').then(function (code) {
			expect(code).toEqual(expectedUtf8);
		});
	});
});

describe('toString terminal', () => {
	const expectedTerminal = fs.readFileSync(path.join(__dirname, '/terminal.expected.out')) + '';

	it('should output a valid symbol', () => {
		QRCode.toString(
			'http://www.google.com',
			{
				errorCorrectionLevel: 'M',
				type: 'terminal',
			},
			function (err, code) {
				expect(err).toBeFalsy();
				expect(`${code}\n`).toEqual(expectedTerminal);
			}
		);
	});

	it('should output a valid symbol (promise)', () => {
		QRCode.toString('http://www.google.com', {
			errorCorrectionLevel: 'M',
			type: 'terminal',
		}).then(function (code) {
			expect(`${code}\n`).toEqual(expectedTerminal);
		});
	});
});

describe('toString byte-input', () => {
	const expectedOutput = [
		'                             ',
		'                             ',
		'    █▀▀▀▀▀█  █▄█▀ █▀▀▀▀▀█    ',
		'    █ ███ █ ▀█ █▀ █ ███ █    ',
		'    █ ▀▀▀ █   ▀ █ █ ▀▀▀ █    ',
		'    ▀▀▀▀▀▀▀ █▄▀▄█ ▀▀▀▀▀▀▀    ',
		'    ▀██▄██▀▀▀█▀▀ ▀█  ▄▀▄     ',
		'    ▀█▀▄█▄▀▄ ██ ▀ ▄ ▀▄  ▀    ',
		'    ▀ ▀ ▀▀▀▀█▄ ▄▀▄▀▄▀▄▀▄▀    ',
		'    █▀▀▀▀▀█ █  █▄█▀█▄█  ▀    ',
		'    █ ███ █ ▀█▀▀ ▀██  ▀█▀    ',
		'    █ ▀▀▀ █ ██▀ ▀ ▄ ▀▄▀▄▀    ',
		'    ▀▀▀▀▀▀▀ ▀▀▀ ▀ ▀▀▀ ▀▀▀    ',
		'                             ',
		'                             ',
	].join('\n');
	const byteInput = new Uint8ClampedArray([1, 2, 3, 4, 5]);

	it('should output the correct code', () => {
		QRCode.toString(
			[{ data: byteInput, mode: 'byte' }],
			{ errorCorrectionLevel: 'L' },
			(err, code) => {
				expect(err).toBeFalsy();
				expect(code).toEqual(expectedOutput);
			}
		);
	});
});
