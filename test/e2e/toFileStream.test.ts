// @ts-nocheck
import QRCode from '../../lib';
import StreamMock from '../mocks/writable-stream';

describe('toFileStream png', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});
	it('should throw if stream is not provided', () => {
		expect(() => {
			QRCode.toFileStream('some text');
		}).toThrow();
	});

	it('should throw if text is not provided', () => {
		expect(() => {
			QRCode.toFileStream(new StreamMock());
		}).toThrow();
	});

	it('should not return an error', () => {
		const fstream = new StreamMock();
		const spy = jest.spyOn(fstream, 'emit');
		QRCode.toFileStream(fstream, 'i am a pony!');

		QRCode.toFileStream(fstream, 'i am a pony!', {
			type: 'image/png',
		});
		expect(spy).not.toHaveBeenCalledWith('error');
	});
});

describe('toFileStream png with write error', () => {
	it('should return an error', () => {
		const fstreamErr = new StreamMock().forceErrorOnWrite();
		QRCode.toFileStream(fstreamErr, 'i am a pony!');

		fstreamErr.on('error', function (e) {
			expect(e).toBeTruthy();
		});
	});
});

describe('toFileStream png with qrcode error', () => {
	it('should return an error', () => {
		const fstreamErr = new StreamMock();
		const bigString = Array(200).join('i am a pony!');
		fstreamErr.on('error', function (e) {
			expect(e).toBeTruthy();
		});

		QRCode.toFileStream(fstreamErr, bigString);
		QRCode.toFileStream(fstreamErr, 'i am a pony!', {
			version: 1, // force version=1 to trigger an error
			errorCorrectionLevel: 'H',
		});
	});
});
