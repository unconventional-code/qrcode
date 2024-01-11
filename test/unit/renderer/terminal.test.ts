import QRCode from '../../../lib/core/qrcode';
import TerminalRenderer from '../../../lib/renderer/terminal';

describe('TerminalRenderer interface', () => {
	it('should have render function', () => {
		expect(TerminalRenderer.render).toBeDefined();
		expect(typeof TerminalRenderer.render).toBe('function');
	})
});

describe('TerminalRenderer render big', () => {
	// @ts-ignore
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	let str: string | undefined;

	it('should not throw with only qrData param', () => {
		expect(() => {
			str = TerminalRenderer.render(sampleQrData);
		}).not.toThrow()
	})

	it('should not throw with options param', () => {
		expect(() => {
			str = TerminalRenderer.render(sampleQrData, {
				margin: 10,
				scale: 1,
			});
		}).not.toThrow()
	})

	it('should return a string', () => {
		expect(typeof str).toBe('string')
	});

	it('should not throw with inverse options', () => {
		expect(() => {
			str = TerminalRenderer.render(sampleQrData, { inverse: true });
		}).not.toThrow()
	})

	it('should return a string if inverse option is set', () => {
		expect(typeof str).toBe('string')
	})
});

describe('TerminalRenderer render small', () => {
	// @ts-ignore
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	let str: string| undefined;
	const callback = jest.fn();

	it('should not throw with only qrData param', () => {
		expect(() => {
			str = TerminalRenderer.render(sampleQrData);
		}).not.toThrow()
	});

	it('should not throw with options param and without callback', () => {
		expect(() => {
			str = TerminalRenderer.render(sampleQrData, {
				margin: 10,
				scale: 1,
				small: true,
			})
		}).not.toThrow()
	});

	it('should not throw with options param and callback', () => {
		expect(() => {
			str = TerminalRenderer.render(
				sampleQrData,
				{
					margin: 10,
					scale: 1,
					small: true,
				},
				callback
			);
		}).not.toThrow()
	});

	it('should return a string', () => {
		expect(typeof str).toBe('string')
	})

	it('should call a callback', () => {
		expect(callback).toHaveBeenCalled();
	})

	it('should not throw with inverse options', () => {
		expect(() => {
			str = TerminalRenderer.render(sampleQrData, { small: true, inverse: true });
		}).not.toThrow()
	});

	it('should return a string if inverse option is set', () => {
		expect(typeof str).toBe('string')
	});
});
