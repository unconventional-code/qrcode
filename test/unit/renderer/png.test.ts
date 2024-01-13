import fs from 'fs';
import * as QRCode from '../../../lib/core/qrcode';
import * as PngRenderer from '../../../lib/renderer/png';
import PNG from 'pngjs';
import StreamMock from '../../mocks/writable-stream';

describe('PNG renderer interface', () => {
	it('should have render function', () => {
		expect(PngRenderer.render).toBeDefined();
		expect(typeof PngRenderer.render).toBe('function');
	});

	it('should have renderToDataURL function', () => {
		expect(PngRenderer.renderToDataURL).toBeDefined();
		expect(typeof PngRenderer.renderToDataURL).toBe('function');
	});

	it('should have renderToFile function', () => {
		expect(PngRenderer.renderToFile).toBeDefined();
		expect(typeof PngRenderer.renderToFile).toBe('function');
	});

	it('should have renderToFileStream function', () => {
		expect(PngRenderer.renderToFileStream).toBeDefined();
		expect(typeof PngRenderer.renderToFileStream).toBe('function');
	});
});

describe('PNG render', () => {
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	let png: any;

	it('should not throw with only qrData param', () => {
		expect(() => {
			png = PngRenderer.render(sampleQrData);
		}).not.toThrow();
	});

	it('should return an instance of PNG', () => {
		expect(png instanceof PNG.PNG).toBe(true);
	});

	it('should be a square image', () => {
		expect(png.width).toBe(png.height);
	});

	// modules: 25, margins: 4 * 2, scale: 4
	it('should have correct size', () => {
		expect(png.width).toBe((25 + 4 * 2) * 4);
	});

	it('should not throw with options param', () => {
		expect(() => {
			png = PngRenderer.render(sampleQrData, {
				margin: 10,
				scale: 1,
			});
		}).not.toThrow();
	});

	it('should be a square image', () => {
		expect(png.width).toBe(png.height);
	});

	// modules: 25, margins: 10 * 2, scale: 1
	it('should have correct size', () => {
		expect(png.width).toBe(25 + 10 * 2);
	});
});

describe('PNG renderToDataURL', () => {
	const sampleQrData = QRCode.create('sample text', { version: 2 });

	it('should not generate errors with only qrData param', () => {
		PngRenderer.renderToDataURL(sampleQrData, function (err: any) {
			expect(err).toBeFalsy();
		});
	});

	it('should return a string', () => {
		PngRenderer.renderToDataURL(sampleQrData, function (err, url) {
			expect(typeof url).toBe('string');
		});
	});

	it('should not generate errors with options param', () => {
		PngRenderer.renderToDataURL(
			sampleQrData,
			{
				margin: 10,
				scale: 1,
			},
			function (err, url) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should return a string', () => {
		PngRenderer.renderToDataURL(
			sampleQrData,
			{
				margin: 10,
				scale: 1,
			},
			function (err, url) {
				expect(typeof url).toBe('string');
			}
		);
	});

	it('should have correct header', () => {
		PngRenderer.renderToDataURL(sampleQrData, { margin: 10, scale: 1 }, function (err, url) {
			expect(url?.split(',')[0]).toBe('data:image/png;base64');
		});
	});

	it('should have a correct length', () => {
		PngRenderer.renderToDataURL(sampleQrData, { margin: 10, scale: 1 }, function (err, url) {
			const length = url?.split(',')[1].length;
			expect(typeof length).toBe('number');
			expect((length ?? 0) % 4).toBe(0);
		});
	});
});

describe('PNG renderToFile', () => {
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	const fileName = 'qrimage.png';

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should not generate errors with only qrData param', () => {
		jest
			.spyOn(fs, 'createWriteStream')
			.mockReturnValue(new StreamMock() as unknown as fs.WriteStream);
		PngRenderer.renderToFile(fileName, sampleQrData, (err) => {
			expect(err).toBeFalsy();
		});
	});

	it('should save file with correct file name', () => {
		const fsSpy = jest.spyOn(fs, 'createWriteStream');
		fsSpy.mockReturnValue(new StreamMock() as unknown as fs.WriteStream);
		PngRenderer.renderToFile(fileName, sampleQrData, function (err: any) {
			expect(fsSpy).toHaveBeenCalledWith(fileName);
		});
	});

	it('should not generate errors with options param', () => {
		jest
			.spyOn(fs, 'createWriteStream')
			.mockReturnValue(new StreamMock() as unknown as fs.WriteStream);
		PngRenderer.renderToFile(
			fileName,
			sampleQrData,
			{
				margin: 10,
				scale: 1,
			},
			function (err: any) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should save file with correct file name', () => {
		const fsSpy = jest.spyOn(fs, 'createWriteStream');
		fsSpy.mockReturnValue(new StreamMock() as unknown as fs.WriteStream);
		PngRenderer.renderToFile(
			fileName,
			sampleQrData,
			{
				margin: 10,
				scale: 1,
			},
			function (err: any) {
				expect(fsSpy).toHaveBeenCalledWith(fileName);
			}
		);
	});

	it('should fail if error occurs during save', () => {
		jest
			.spyOn(fs, 'createWriteStream')
			.mockReturnValue(new StreamMock().forceErrorOnWrite() as unknown as fs.WriteStream);

		PngRenderer.renderToFile(fileName, sampleQrData, function (err: any) {
			expect(err).toBeTruthy();
		});
	});
});

describe('PNG renderToFileStream', () => {
	const sampleQrData = QRCode.create('sample text', { version: 2 });

	it('should not throw with only qrData param', () => {
		expect(() => {
			PngRenderer.renderToFileStream(new StreamMock() as unknown as fs.WriteStream, sampleQrData);
		}).not.toThrow();
	});

	it('should not throw with options param', () => {
		expect(() => {
			PngRenderer.renderToFileStream(new StreamMock() as unknown as fs.WriteStream, sampleQrData, {
				margin: 10,
				scale: 1,
			});
		}).not.toThrow();
	});
});
