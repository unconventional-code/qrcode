import fs from 'fs';
import { PNG } from 'pngjs';
import * as Utils from './utils';
import { QRCode } from '../core/qrcode';

export function render(qrData: QRCode, options?: Utils.QRCodeOptionsInput) {
	const opts = Utils.getOptions(options);
	const pngOpts = opts.rendererOpts;
	const size = Utils.getImageWidth(qrData.modules.size, opts);
	const pngImage = new PNG({
		...(pngOpts ?? {}),
		width: size,
		height: size,
	});
	Utils.qrToImageData(pngImage.data as unknown as unknown[], qrData, opts);

	return pngImage;
}

export function renderToBuffer(
	qrData: QRCode,
	optionsOrCb?:
		| Utils.QRCodeOptionsInput
		| ((error: Error | null | undefined, buffer: Buffer) => void),
	cb?: (error: Error | null | undefined, buffer: Buffer) => void
) {
	const actualOptions = typeof optionsOrCb === 'object' ? optionsOrCb : {};
	const actualCb =
		typeof cb === 'function' ? cb : typeof optionsOrCb === 'function' ? optionsOrCb : () => {};

	const png = exports.render(qrData, actualOptions);
	const buffer: number[] = [];

	png.on('error', actualCb);

	png.on('data', function (data: number) {
		buffer.push(data);
	});

	png.on('end', function () {
		actualCb(null, Buffer.concat(buffer as unknown as Uint8Array[]));
	});

	png.pack();
}

export function renderToDataURL(
	qrData: QRCode,
	optionsOrCb?:
		| Utils.QRCodeOptionsInput
		| ((error: Error | null | undefined, string?: string) => void),
	cb?: (error: Error | null | undefined, string?: string) => void
) {
	const actualOptions = typeof optionsOrCb === 'object' ? optionsOrCb : {};
	const actualCb =
		typeof cb === 'function' ? cb : typeof optionsOrCb === 'function' ? optionsOrCb : () => {};

	renderToBuffer(qrData, actualOptions, function (err, output) {
		if (err) {
			actualCb(err);
		}
		let url = 'data:image/png;base64,';
		url += output.toString('base64');
		actualCb(null, url);
	});
}

export function renderToFileStream(
	stream: fs.WriteStream,
	qrData: QRCode,
	options?: Utils.QRCodeOptionsInput
) {
	const png = render(qrData, options);
	png.pack().pipe(stream);
}

export function renderToFile(
	path: string,
	qrData: QRCode,
	optionsOrCb?: Utils.QRCodeToFileOptions | ((error: Error | null | undefined) => void),
	cb?: (error: Error | null | undefined) => void
) {
	const actualOptions = typeof optionsOrCb === 'object' ? optionsOrCb : {};
	const actualCb =
		typeof cb === 'function' ? cb : typeof optionsOrCb === 'function' ? optionsOrCb : () => {};

	let called = false;
	// @ts-ignore
	const done = (...args) => {
		if (called) return;
		called = true;
		// @ts-ignore
		actualCb.apply(null, args);
	};
	const stream = fs.createWriteStream(path);

	stream.on('error', done);
	stream.on('close', done);

	renderToFileStream(stream, qrData, actualOptions);
}
