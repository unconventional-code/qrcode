import BitMatrix from '../../../lib/core/bit-matrix';
import { L } from '../../../lib/core/error-correction-level';
import { QRCode } from '../../../lib/core/qrcode';
import * as Utils from '../../../lib/renderer/utils';

describe('Utils getOptions', () => {
	const defaultOptions = {
		width: undefined,
		scale: 4,
		margin: 4,
		color: {
			dark: { r: 0, g: 0, b: 0, a: 255, hex: '#000000' },
			light: { r: 255, g: 255, b: 255, a: 255, hex: '#ffffff' },
		},
		type: undefined,
		rendererOpts: {},
	};

	it('should be defined', () => {
		expect(Utils.getOptions).toBeDefined();
	});

	it('should return default options if called without param', () => {
		// deepEqual
		expect(Utils.getOptions(undefined as unknown as Utils.QRCodeOptionsInput)).toEqual(
			defaultOptions
		);
	});

	it('should return correct scale value', () => {
		expect(Utils.getOptions({ scale: 8 }).scale).toEqual(8);
	});

	it('should reset scale value to default if width is set', () => {
		expect(Utils.getOptions({ width: 300 }).scale).toEqual(4);
	});

	it('should return default margin if specified value is null', () => {
		expect(Utils.getOptions({ margin: undefined }).margin).toEqual(4);
	});

	it('should return default margin if specified value is < 0', () => {
		expect(Utils.getOptions({ margin: -1 }).margin).toEqual(4);
	});

	it('should return correct margin value', () => {
		expect(Utils.getOptions({ margin: 20 }).margin).toEqual(20);
	});

	it('should return correct colors value from strings', () => {
		expect(Utils.getOptions({ color: { dark: '#fff', light: '#000000' } }).color).toEqual({
			dark: { r: 255, g: 255, b: 255, a: 255, hex: '#ffffff' },
			light: { r: 0, g: 0, b: 0, a: 255, hex: '#000000' },
		});
	});

	it('should throw if color is not a string', () => {
		expect(() => Utils.getOptions({ color: { dark: true as unknown as string } })).toThrow();
	});

	it('should throw if color is not in a valid hex format', () => {
		expect(() => Utils.getOptions({ color: { dark: '#aa' } })).toThrow();
	});
});

describe('Utils getScale', () => {
	const symbolSize = 21;

	it('should return correct scale value', () => {
		expect(Utils.getScale(symbolSize, { scale: 5 })).toEqual(5);
	});

	it('should calculate correct scale from width and margin', () => {
		expect(Utils.getScale(symbolSize, { width: 50, margin: 2 })).toEqual(2);
	});

	it('should return default scale if width is too small to contain the symbol', () => {
		expect(Utils.getScale(symbolSize, { width: 21, margin: 2, scale: 4 })).toEqual(4);
	});
});

describe('Utils getImageWidth', () => {
	const symbolSize = 21;

	it('should return correct width value', () => {
		expect(Utils.getImageWidth(symbolSize, { scale: 5, margin: 0 })).toEqual(105);
	});

	it('should return specified width value', () => {
		expect(Utils.getImageWidth(symbolSize, { width: 250, margin: 2 })).toEqual(250);
	});

	it('should ignore width option if too small to contain the symbol', () => {
		expect(Utils.getImageWidth(symbolSize, { width: 10, margin: 4, scale: 4 })).toEqual(116);
	});
});

describe('Utils qrToImageData', () => {
	it('should be defined', () => {
		expect(Utils.qrToImageData).toBeDefined();
	});

	const sampleQrData: QRCode = {
		modules: {
			data: [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1],
			size: 4,
		} as unknown as BitMatrix,
		version: 1,
		segments: [],
		maskPattern: 0,
		errorCorrectionLevel: L,
	};

	const margin = 4;
	const scale = 2;
	const width = 100;

	const color = {
		dark: { r: 255, g: 255, b: 255, a: 255, hex: '#ffffffff' },
		light: { r: 0, g: 0, b: 0, a: 255, hex: '#000000ff' },
	};

	const opts: Utils.QRCodeOptionsOutput = {
		margin: margin,
		scale: scale,
		color: color,
		rendererOpts: {},
	};

	let imageData: unknown[] = [];
	const expectedImageSize = (sampleQrData.modules.size + margin * 2) * scale;
	let expectedImageDataLength = Math.pow(expectedImageSize, 2) * 4;

	Utils.qrToImageData(imageData, sampleQrData, opts);

	it('should return correct imageData length', () => {
		expect(imageData.length).toEqual(expectedImageDataLength);
	});

	imageData = [];
	opts.width = width;
	expectedImageDataLength = Math.pow(width, 2) * 4;

	Utils.qrToImageData(imageData, sampleQrData, opts);

	it('should return correct imageData length', () => {
		expect(imageData.length).toEqual(expectedImageDataLength);
	});
});
