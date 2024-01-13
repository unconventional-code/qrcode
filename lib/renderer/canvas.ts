import { QRCode } from '../core/qrcode';
import * as Utils from './utils';

function clearCanvas(
	ctx: CanvasRenderingContext2D | null,
	canvas: HTMLCanvasElement,
	size: number
) {
	ctx?.clearRect(0, 0, canvas.width, canvas.height);

	if (!canvas.style) {
		// @ts-ignore deliberately overriding styles
		canvas.style = {};
	}
	canvas.height = size;
	canvas.width = size;
	canvas.style.height = size + 'px';
	canvas.style.width = size + 'px';
}

function getCanvasElement() {
	try {
		return document.createElement('canvas');
	} catch (e) {
		throw new Error('You need to specify a canvas element');
	}
}

export function render(
	qrData: QRCode,
	canvasOrOptions?: HTMLCanvasElement | Utils.QRCodeOptionsInput,
	options?: Utils.QRCodeOptionsInput
) {
	const canvasEl =
		!!canvasOrOptions && 'getContext' in canvasOrOptions ? canvasOrOptions : getCanvasElement();
	const _options =
		typeof options === 'object'
			? options
			: !!canvasOrOptions && !('getContext' in canvasOrOptions)
				? canvasOrOptions
				: {};

	const opts = Utils.getOptions(_options);
	const size = Utils.getImageWidth(qrData.modules.size, opts);

	const ctx = canvasEl.getContext('2d');
	const image = ctx?.createImageData(size, size);
	if (image) {
		// @ts-ignore
		Utils.qrToImageData(image.data, qrData, opts);
		clearCanvas(ctx, canvasEl, size);
		ctx?.putImageData(image, 0, 0);
	}

	return canvasEl;
}

export function renderToDataURL(
	qrData: QRCode,
	canvasOrOptions?: HTMLCanvasElement | Utils.QRCodeOptionsInput,
	options?: Utils.QRCodeOptionsInput
) {
	const canvas =
		typeof canvasOrOptions === 'object' && 'getContext' in canvasOrOptions
			? canvasOrOptions
			: undefined;

	const opts =
		(typeof options === 'undefined' &&
		typeof canvasOrOptions === 'object' &&
		!('getContext' in canvasOrOptions)
			? canvasOrOptions
			: options) ?? {};

	const canvasEl = render(qrData, canvas, opts);

	const type = opts.type || 'image/png';
	const rendererOpts = 'rendererOpts' in opts ? opts.rendererOpts ?? {} : {};

	const quality = 'quality' in rendererOpts ? rendererOpts.quality : undefined;

	return canvasEl.toDataURL(type, quality);
}
