// @ts-nocheck
import fs from 'fs';
import path from 'path';
import os from 'os';
import QRCode from '../../lib';
import Helpers from '../helpers';
import StreamMock from '../mocks/writable-stream';

describe('toFile - no promise available', () => {
	const fileName = path.join(os.tmpdir(), `${Math.random().toFixed(4)}.png`);
	beforeAll(() => {
		Helpers.removeNativePromise();
	});

	afterAll(() => {
		Helpers.restoreNativePromise();
	});
	it('should throw if a callback is not provided', () => {
		expect(() => {
			QRCode.toFile(fileName, 'some text');
		}).toThrow();
	});

	it('should throw if a callback is not a function', () => {
		expect(() => {
			QRCode.toFile(fileName, 'some text', {});
		}).toThrow();
	});
});

describe('toFile', () => {
	const fileName = path.join(os.tmpdir(), `${Math.random().toFixed(4)}.png`);

	it('should throw if path is not provided', () => {
		expect(() => {
			QRCode.toFile('some text', function () {});
		}).toThrow();
	});

	it('should throw if text is not provided', () => {
		expect(() => {
			QRCode.toFile(fileName);
		}).toThrow();
	});

	it('should return a promise', () => {
		expect(typeof QRCode.toFile(fileName, 'some text').then).toBe('function');
	});
});

describe('toFile png', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});
	const fileName = path.join(os.tmpdir(), `${Math.random().toFixed(4)}.png`);
	const expectedBase64Output = [
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

	it('should save file with correct file name and write correct content', () => {
		QRCode.toFile(
			fileName,
			'i am a pony!',
			{
				errorCorrectionLevel: 'L',
			},
			function (err) {
				expect(err).toBeFalsy();
				const buffer = fs.readFileSync(fileName);
				expect(buffer.toString('base64')).toEqual(expectedBase64Output);
			}
		);
	});

	it('should not return errors if file type is specified', () => {
		QRCode.toFile(
			fileName,
			'i am a pony!',
			{
				errorCorrectionLevel: 'L',
				type: 'png',
			},
			function (err) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should save file with correct file name and write correct content (promise)', () => {
		QRCode.toFile(fileName, 'i am a pony!', {
			errorCorrectionLevel: 'L',
		}).then(() => {
			const buffer = fs.readFileSync(fileName);
			expect(buffer.toString('base64')).toEqual(expectedBase64Output);
		});
	});

	it('should return an error', () => {
		jest.spyOn(fs, 'createWriteStream').mockReturnValue(new StreamMock().forceErrorOnWrite());
		QRCode.toFile(
			fileName,
			'i am a pony!',
			{
				errorCorrectionLevel: 'L',
			},
			function (err) {
				expect(err).toBeTruthy();
			}
		);
	});

	it('should catch an error (promise)', () => {
		jest.spyOn(fs, 'createWriteStream').mockReturnValue(new StreamMock().forceErrorOnWrite());

		QRCode.toFile(fileName, 'i am a pony!', {
			errorCorrectionLevel: 'L',
		}).catch(function (err) {
			expect(err).toBeTruthy();
		});
	});
});

describe('toFile svg', () => {
	const fileName = path.join(os.tmpdir(), `${Math.random().toFixed(4)}.svg`);
	const expectedOutput = fs.readFileSync(path.join(__dirname, '/svg.expected.out'), 'UTF-8');

	it('should save file with correct file name and write correct content', () => {
		QRCode.toFile(
			fileName,
			'http://www.google.com',
			{
				errorCorrectionLevel: 'H',
			},
			function (err) {
				expect(err).toBeFalsy();
				const content = fs.readFileSync(fileName, 'utf-8');
				expect(content).toEqual(expectedOutput);
			}
		);
	});

	it('should not return errors if file type is specified', () => {
		QRCode.toFile(
			fileName,
			'http://www.google.com',
			{
				errorCorrectionLevel: 'H',
				type: 'svg',
			},
			function (err) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should save file with correct file name and write correct content (promise)', () => {
		QRCode.toFile(fileName, 'http://www.google.com', {
			errorCorrectionLevel: 'H',
		}).then(function () {
			const content = fs.readFileSync(fileName, 'utf-8');
			expect(content).toEqual(expectedOutput);
		});
	});
});

describe('toFile utf8', () => {
	const fileName = path.join(os.tmpdir(), `${Math.random().toFixed(4)}.txt`);
	const expectedOutput = [
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

	it('should save file with correct file name and write correct content', () => {
		QRCode.toFile(fileName, 'http://www.google.com', function (err) {
			expect(err).toBeFalsy();
			const content = fs.readFileSync(fileName, 'utf8');
			expect(content).toEqual(expectedOutput);
		});
	});

	it('should not return errors if file type is specified', () => {
		QRCode.toFile(
			fileName,
			'http://www.google.com',
			{
				errorCorrectionLevel: 'M',
				type: 'utf8',
			},
			function (err) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should save file with correct file name and write correct content (promise)', () => {
		QRCode.toFile(fileName, 'http://www.google.com').then(function () {
			const content = fs.readFileSync(fileName, 'utf8');
			expect(content).toEqual(expectedOutput);
		});
	});
});

describe('toFile manual segments', () => {
	const fileName = path.join(os.tmpdir(), `${Math.random().toFixed(4)}.txt`);
	const segs = [
		{ data: 'ABCDEFG', mode: 'alphanumeric' },
		{ data: '0123456', mode: 'numeric' },
	];
	const expectedOutput = [
		'                             ',
		'                             ',
		'    █▀▀▀▀▀█ ██▀██ █▀▀▀▀▀█    ',
		'    █ ███ █  █▀█▄ █ ███ █    ',
		'    █ ▀▀▀ █ █ ▄ ▀ █ ▀▀▀ █    ',
		'    ▀▀▀▀▀▀▀ █▄█▄▀ ▀▀▀▀▀▀▀    ',
		'    ▀██ ▄▀▀▄█▀▀▀▀██▀▀▄ █▀    ',
		'     ▀█▀▀█▀█▄ ▄ ▄█▀▀▀█▀      ',
		'    ▀ ▀▀▀ ▀ ▄▀ ▄ ▄▀▄  ▀▄     ',
		'    █▀▀▀▀▀█ ▄  █▀█ ▀▀▀▄█▄    ',
		'    █ ███ █  █▀▀▀ ██▀▀ ▀▀    ',
		'    █ ▀▀▀ █ ██  ▄▀▀▀▀▄▀▀█    ',
		'    ▀▀▀▀▀▀▀ ▀    ▀▀▀▀ ▀▀▀    ',
		'                             ',
		'                             ',
	].join('\n');

	it('should save file with correct file name and write correct content', () => {
		QRCode.toFile(
			fileName,
			segs,
			{
				errorCorrectionLevel: 'L',
			},
			function (err) {
				expect(err).toBeFalsy();
				const content = fs.readFileSync(fileName, 'utf8');
				expect(content).toEqual(expectedOutput);
			}
		);
	});
});
