// @ts-nocheck
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
	canvas?: HTMLCanvasElement | Utils.QRCodeOptionsInput,
	options?: Utils.QRCodeOptionsInput
) {
	const canvasEl = !!canvas && 'getContext' in canvas ? canvas : getCanvasElement();
	const _options =
		typeof options === 'object' ? options : !!canvas && !('getContext' in canvas) ? canvas : {};

	const opts = Utils.getOptions(_options);
	const size = Utils.getImageWidth(qrData.modules.size, opts);

	const ctx = canvasEl.getContext('2d');
	const image = ctx?.createImageData(size, size);
	if (image) {
		Utils.qrToImageData(image.data, qrData, opts);
		clearCanvas(ctx, canvasEl, size);
		ctx?.putImageData(image, 0, 0);
	}

	return canvasEl;
}

export function renderToDataURL(
	qrData: QRCode,
	canvas?: HTMLCanvasElement | Utils.QRCodeOptionsInput,
	options?: Utils.QRCodeOptionsInput
) {
	let opts = options;

	if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
		opts = canvas;
		canvas = undefined;
	}

	if (!opts) opts = {};

	const canvasEl = exports.render(qrData, canvas, opts);

	const type = opts.type || 'image/png';
	const rendererOpts = opts.rendererOpts || {};

	return canvasEl.toDataURL(type, rendererOpts.quality);
}
