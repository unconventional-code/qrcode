// @ts-nocheck
import QRCode from '../../lib';
import QRCodeBrowser from '../../lib/browser';
import { createCanvas } from 'canvas';
import * as Helpers from '../helpers';

describe('toDataURL - no promise available', () => {
	beforeAll(() => {
		Helpers.removeNativePromise();
	});

	afterAll(() => {
		Helpers.restoreNativePromise();
	});

	it('should throw if no arguments are provided', () => {
		expect(() => QRCode.toDataURL()).toThrow();
	});

	it('should throw if text is not provided', () => {
		expect(() => QRCode.toDataURL(function () {})).toThrow();
	});

	it('should throw if a callback is not provided', () => {
		expect(() => QRCode.toDataURL('some text')).toThrow();
	});

	it('should throw if a callback is not a function', () => {
		expect(() => QRCode.toDataURL('some text', {})).toThrow();
	});

	it('should throw if no arguments are provided (browser)', () => {
		expect(() => QRCodeBrowser.toDataURL()).toThrow();
	});

	it('should throw if text is not provided (browser)', () => {
		expect(() => QRCodeBrowser.toDataURL(function () {})).toThrow();
	});

	it('should throw if a callback is not provided (browser)', () => {
		expect(() => QRCodeBrowser.toDataURL('some text')).toThrow();
	});

	it('should throw if a callback is not a function (browser)', () => {
		expect(() => QRCodeBrowser.toDataURL('some text', {})).toThrow();
	});
});

describe('toDataURL - image/png', () => {
	const expectedDataURL = [
		'data:image/png;base64,',
		'iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKzSU',
		'RBVO3BQW7kQAwEwSxC//9y7h55akCQxvYQjIj/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp',
		'1ijFGqVYoxRrlGKNUqxRijXKxUNJ+EkqdyShU+mS0Kl0SfhJKk8Ua5RijVKsUS5epvKmJD',
		'yh8iaVNyXhTcUapVijFGuUiw9Lwh0qdyShU+mS0Kl0Kk8k4Q6VTyrWKMUapVijXHw5lROV',
		'kyR0Kt+sWKMUa5RijXIxTBI6lS4JkxVrlGKNUqxRLj5M5Tcl4UTlCZW/pFijFGuUYo1y8b',
		'Ik/KQkdCpdEjqVLgmdykkS/rJijVKsUYo1ysVDKt9M5UTlmxRrlGKNUqxRLh5Kwh0qXRJ+',
		'UxLuULkjCZ3KJxVrlGKNUqxRLh5S6ZLQqXRJ6FS6JHQqXRKeSEKn0iWhUzlJwolKl4QTlS',
		'eKNUqxRinWKBe/LAmdSpeETuUkCZ1Kl4QTlS4Jd6h0SehUuiS8qVijFGuUYo1y8WFJ6FS6',
		'JJyofFISOpVOpUtCp3KicqLypmKNUqxRijXKxYep3JGEE5UuCZ3KHSp3qHRJ6FR+U7FGKd',
		'YoxRol/scXS8ITKidJeEKlS8KJyhPFGqVYoxRrlIuHkvCTVE5U7kjCicpJEk6S8JOKNUqx',
		'RinWKBcvU3lTEu5IwolKp/KEyh1J6FTeVKxRijVKsUa5+LAk3KHyJpWTJHQqdyShU/lNxR',
		'qlWKMUa5SLL6fSJaFLwhNJeCIJP6lYoxRrlGKNcvHlknCicpKEE5UuCSdJOFHpktCpPFGs',
		'UYo1SrFGufgwlZ+k0iWhU+lUnlDpktCpdEnoVN5UrFGKNUqxRrl4WRL+EpU7ktCpdCpdEj',
		'qVO5LQqTxRrFGKNUqxRon/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKN',
		'UqxRijXKP0OHEepgrecVAAAAAElFTkSuQmCC',
	].join('');

	it('should throw if no arguments are provided', () => {
		expect(() => QRCode.toDataURL()).toThrow();
	});

	it('should not throw an error', () => {
		QRCode.toDataURL(
			'i am a pony!',
			{
				errorCorrectionLevel: 'L',
				type: 'image/png',
			},
			function (err, url) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should return a url that matches expected value for error correction L', () => {
		QRCode.toDataURL(
			'i am a pony!',
			{
				errorCorrectionLevel: 'L',
				type: 'image/png',
			},
			function (err, url) {
				expect(url).toEqual(expectedDataURL);
			}
		);
	});

	it('should throw an error', () => {
		QRCode.toDataURL(
			'i am a pony!',
			{
				version: 1, // force version=1 to trigger an error
				errorCorrectionLevel: 'H',
				type: 'image/png',
			},
			function (err, url) {
				expect(err).toBeTruthy();
			}
		);
	});

	it('should return null for the url', () => {
		QRCode.toDataURL(
			'i am a pony!',
			{
				version: 1, // force version=1 to trigger an error
				errorCorrectionLevel: 'H',
				type: 'image/png',
			},
			function (err, url) {
				expect(url).toBeUndefined();
			}
		);
	});

	it('should return a promise', () => {
		expect(typeof QRCode.toDataURL('i am a pony!').then).toBe('function');
	});

	it('should return a url that matches expected value for error correction L (promise)', () => {
		QRCode.toDataURL('i am a pony!', {
			errorCorrectionLevel: 'L',
			type: 'image/png',
		}).then(function (url) {
			expect(url).toEqual(expectedDataURL);
		});
	});

	it('should return an error (promise)', () => {
		QRCode.toDataURL('i am a pony!', {
			version: 1, // force version=1 to trigger an error
			errorCorrectionLevel: 'H',
			type: 'image/png',
		}).catch(function (err) {
			expect(err).toBeTruthy();
		});
	});
});

describe('Canvas toDataURL - image/png', () => {
	const expectedDataURL = [
		'data:image/png;base64,',
		'iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAABmJLR0QA/wD/AP+gvaeTAA',
		'AC20lEQVR4nO3dQY7jMAwEwM1i///lzGUurYtWEEknQNV1EidjNGhFpuTX+/1+/4Fff5/+',
		'AnwWgSAIBEEgCAJBEAiCQBAEgiAQBIEgCARBIAgCQRAIgkAQ/t0e4PV6VXyP/7a2b6yff9',
		'vecXq83eufPj+nVAiCQBAEgnA9hlhVt2jursGn1/hbt2OW6fNzSoUgCARBIAjlY4jV6TWu',
		'ex7hdt7g6TFA9zIaFYIgEASBILSPIbrdjhlWt/civn2prApBEAiCQBC+fgzR3R8xfa/kaS',
		'oEQSAIAkFoH0N82u/y03sVuzFJ9xhlmgpBEAiCQBDKxxDTv8u7+x9uP3/3+k+jQhAEgiAQ',
		'hOsxxNO/o0/7G07/fuvp83NKhSAIBEEgCK/u52VUzwNUr6Ponkc4Pb3V+1OcUiEIAkEQCE',
		'L5HlPT17zuPZ1ux0Dde2BVUyEIAkEQCEL5vYzTa271NfF2nUb1vMj097mlQhAEgiAQhPG1',
		'nbf3IqbnBXZjnuq9sKfncVYqBEEgCAJBGL+XsTqdp6g+/qr7Gr2q/n/0Q1BKIAgCQSjvqa',
		'z+3b07/qq6h3G6Z3P3/h1jCEoJBEEgCO3zEJ/ej3Cq+hlb3etSTqkQBIEgCATh4+YhqucF',
		'nu5fmD7+LRWCIBAEgSA83g+xmu45nH4m1+3nd1MhCAJBEAhC+x5T3br7I05193d0P5tchS',
		'AIBEEgCOXzEN1un3lV/Qyt6nUe3f0OOyoEQSAIAkEo3x+ielrj9Bq96h5z7Dx9b+eUCkEQ',
		'CIJAENr3mJpemzjdU7l7/7dRIQgCQRAIwvg+ldWm13Wc6t4Hs5oKQRAIgkAQvn4MUb1WdP',
		'q5nKevt08lowSCIBCE9jHE9F7R0/MGu7/f9lDqh+BRAkEQCML12s6n12Wcqp5n6N5X8/Tz',
		'zENQSiAIAkH4+v0hqKVCEASCIBAEgSAIBEEgCAJBEAiCQBAEgiAQBIEgCARBIAgCQfgBlZ',
		'7HAm5AupgAAAAASUVORK5CYII=',
	].join('');

	it('should throw if no arguments are provided', () => {
		expect(() => QRCodeBrowser.toDataURL()).toThrow();
	});

	it('should throw if text is not provided', () => {
		expect(() => QRCodeBrowser.toDataURL(function () {})).toThrow();
	});

	const canvas = createCanvas(200, 200);

	it('should not throw an error', () => {
		QRCodeBrowser.toDataURL(
			canvas,
			'i am a pony!',
			{
				errorCorrectionLevel: 'H',
				type: 'image/png',
			},
			function (err, url) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should return a url that matches the expected value', () => {
		QRCodeBrowser.toDataURL(
			canvas,
			'i am a pony!',
			{
				errorCorrectionLevel: 'H',
				type: 'image/png',
			},
			function (err, url) {
				expect(url).toEqual(expectedDataURL);
			}
		);
	});

	it('should return an error', () => {
		QRCodeBrowser.toDataURL(
			canvas,
			'i am a pony!',
			{
				version: 1, // force version=1 to trigger an error
				errorCorrectionLevel: 'H',
				type: 'image/png',
			},
			function (err, url) {
				expect(err).toBeTruthy();
			}
		);
	});

	it('should return null for the url', () => {
		QRCodeBrowser.toDataURL(
			canvas,
			'i am a pony!',
			{
				version: 1, // force version=1 to trigger an error
				errorCorrectionLevel: 'H',
				type: 'image/png',
			},
			function (err, url) {
				expect(url).toBeUndefined();
			}
		);
	});

	it('should return a url that matches the expected value (promise)', () => {
		QRCodeBrowser.toDataURL(canvas, 'i am a pony!', {
			errorCorrectionLevel: 'H',
			type: 'image/png',
		}).then(function (url) {
			expect(url).toEqual(expectedDataURL);
		});
	});

	it('should return an error (promise)', () => {
		QRCodeBrowser.toDataURL(canvas, 'i am a pony!', {
			version: 1, // force version=1 to trigger an error
			errorCorrectionLevel: 'H',
			type: 'image/png',
		}).catch(function (err) {
			expect(err).toBeTruthy();
		});
	});

	// Mock document object
	// global.document = {
	// 	createElement: function (el) {
	// 		if (el === 'canvas') {
	// 			return createCanvas(200, 200);
	// 		}
	// 	},
	// };

	it('should not return an error', () => {
		QRCodeBrowser.toDataURL(
			'i am a pony!',
			{
				errorCorrectionLevel: 'H',
				type: 'image/png',
			},
			function (err, url) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should return a url that matches the expected value', () => {
		QRCodeBrowser.toDataURL(
			'i am a pony!',
			{
				errorCorrectionLevel: 'H',
				type: 'image/png',
			},
			function (err, url) {
				expect(url).toEqual(expectedDataURL);
			}
		);
	});

	it('should return a url that matches the expected value (promise)', () => {
		QRCodeBrowser.toDataURL('i am a pony!', {
			errorCorrectionLevel: 'H',
			type: 'image/png',
		}).then(function (url) {
			expect(url).toEqual(expectedDataURL);
		});
	});
});
