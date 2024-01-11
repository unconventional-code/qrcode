const { Canvas, createCanvas } = require('canvas');
import QRCode from '../../../lib/core/qrcode';
import CanvasRenderer from '../../../lib/renderer/canvas';

describe('CanvasRenderer interface', () => {
	it('should have render function', () => {
		expect(CanvasRenderer.render).toBeDefined();
		expect(typeof CanvasRenderer.render).toBe('function');
	});

	it('should have renderToDataURL function', () => {
		expect(CanvasRenderer.renderToDataURL).toBeDefined();
		expect(typeof CanvasRenderer.renderToDataURL).toBe('function');
	});

});

describe('CanvasRenderer render', () => {
	// Mock document object
	beforeEach(() => {
		jest.spyOn(global.document, 'createElement').mockImplementation((el) => {
			if (el === 'canvas') {
				return createCanvas(200, 200);
			}
		});
	})

	afterEach(() => {
		jest.restoreAllMocks();
	})

	// @ts-ignore
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	let canvasEl: any

	it('should not throw if canvas is not provided', () => {
		expect(() => {
			canvasEl = CanvasRenderer.render(sampleQrData);
		}).not.toThrow();
	})

	it('should return a new canvas object', () => {
		expect(canvasEl instanceof Canvas).toBe(true);
	});

	it('should not throw with options param', () => {
		expect(() => {
			canvasEl = CanvasRenderer.render(sampleQrData, {
				margin: 10,
				scale: 1,
			});
		}).not.toThrow();
	})

	// modules: 25, margins: 10 * 2, scale: 1
	it('should have correct size', () => {
		expect(canvasEl.width).toBe(25 + 10 * 2);
	})

	it('should be a square image', () => {
		expect(canvasEl.width).toBe(canvasEl.height);
	});

	it('should throw if canvas cannot be created', () => {
		jest.spyOn(global.document, 'createElement').mockImplementation((el) => {
			throw new Error()
		});

		expect(() => {
			canvasEl = CanvasRenderer.render(sampleQrData);
		}).toThrow();
	})

});

describe('CanvasRenderer render to provided canvas', () => {

	// @ts-ignore
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	const canvasEl = createCanvas(200, 200);

	it('should not throw with only qrData and canvas param', () => {
		expect(() => {
			CanvasRenderer.render(sampleQrData, canvasEl);
		}).not.toThrow();
	});

	it('should not throw with options param', () => {
		expect(() => {
			CanvasRenderer.render(sampleQrData, canvasEl, {
				margin: 10,
				scale: 1,
			});
		}).not.toThrow();
	})

	// modules: 25, margins: 10 * 2, scale: 1
	it('should have correct size', () => {
		expect(canvasEl.width).toBe(25 + 10 * 2);
	});

	it('should be a square image', () => {
		expect(canvasEl.width).toBe(canvasEl.height);
	})
});

describe('CanvasRenderer renderToDataURL', () => {
	beforeEach(() => {
		// Mock document object
		jest.spyOn(global.document, 'createElement').mockImplementation((el) => {
			if (el === 'canvas') {
				return createCanvas(200, 200);
			}
		});
	})
	// @ts-ignore
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	let url: string;

	it('should not throw if canvas is not provided', () => {
		expect(() => {
			url = CanvasRenderer.renderToDataURL(sampleQrData);
		}).not.toThrow();
	})

	it('should not throw with options param', () => {
		expect(() => {
			url = CanvasRenderer.renderToDataURL(sampleQrData, {
				margin: 10,
				scale: 1,
				type: 'image/png',
			});
		}).not.toThrow();
	})

	it('should return a string', () => {
		expect(typeof url).toBe('string');
	});

	it('should have correct header', () => {
		expect(url.split(',')[0]).toBe('data:image/png;base64');
	});


	it('should have correct length', () => {
		const b64png = url.split(',')[1];
		expect(b64png.length % 4).toBe(0);
	})
});

describe('CanvasRenderer renderToDataURL to provided canvas', () => {
	// @ts-ignore
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	const canvasEl = createCanvas(200, 200);
	let url: string

	it('should not throw with only qrData and canvas param', () => {
		expect(() => {
			url = CanvasRenderer.renderToDataURL(sampleQrData, canvasEl);
		}).not.toThrow();
	})

	it('should not throw with options param', () => {
		expect(() => {
			url = CanvasRenderer.renderToDataURL(sampleQrData, canvasEl, {
				margin: 10,
				scale: 1,
				type: 'image/png',
			});
		});
	});

	it('should return a string', () => {
		expect(typeof url).toBe('string');
	});

	it('should have correct header', () => {
		expect(url.split(',')[0]).toBe('data:image/png;base64');
	});

	it('should have correct length', () => {
		const b64png = url.split(',')[1];
		expect(b64png.length % 4).toBe(0);
	});

});
