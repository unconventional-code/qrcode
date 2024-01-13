import fs from 'fs';
import * as QRCode from '../../../lib/core/qrcode';
import * as Utf8Renderer from '../../../lib/renderer/utf8';

describe('Utf8Renderer interface', () => {
	it('should have render function', () => {
		expect(Utf8Renderer.render).toBeDefined();
		expect(typeof Utf8Renderer.render).toBe('function');
	});
});

describe('Utf8Renderer render', () => {
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	let str: string | undefined;

	it('should not throw with only qrData param', () => {
		expect(() => {
			str = Utf8Renderer.render(sampleQrData);
		}).not.toThrow();
	});

	it('should not throw with options param', () => {
		expect(() => {
			str = Utf8Renderer.render(sampleQrData, {
				margin: 10,
				scale: 1,
			});
		}).not.toThrow();
	});

	it('should return a string', () => {
		expect(typeof str).toBe('string');
	});
});

describe('Utf8 renderToFile', () => {
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	const fileName = 'qrimage.txt';

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should not generate errors with only qrData param', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {});

		Utf8Renderer.renderToFile(fileName, sampleQrData, function (err) {
			expect(err).toBeFalsy();
		});
	});

	it('should save file with correct file name', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {});
		Utf8Renderer.renderToFile(fileName, sampleQrData, function (err) {
			expect(fsSpy).toHaveBeenCalledWith(fileName);
		});
	});

	it('should not generate errors with options param', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {});
		Utf8Renderer.renderToFile(
			fileName,
			sampleQrData,
			{
				margin: 10,
				scale: 1,
			},
			function (err) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should save file with correct file name', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {});
		Utf8Renderer.renderToFile(
			fileName,
			sampleQrData,
			{
				margin: 10,
				scale: 1,
			},
			function (err) {
				expect(fsSpy).toHaveBeenCalledWith(fileName);
			}
		);
	});

	it('should fail if error occurs during save', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {
			cb(new Error());
		});
		Utf8Renderer.renderToFile(fileName, sampleQrData, function (err) {
			expect(err).toBeTruthy();
		});
	});
});
