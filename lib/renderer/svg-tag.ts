import { QRCode } from '../core/qrcode';

import * as Utils from './utils';

function getColorAttrib(color: ReturnType<typeof Utils.hex2rgba>, attrib: 'fill' | 'stroke') {
	const alpha = color.a / 255;
	const str = attrib + '="' + color.hex + '"';

	return alpha < 1 ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
}

type SvgDCommands =
	| 'M'
	| 'm'
	| 'L'
	| 'l'
	| 'H'
	| 'h'
	| 'V'
	| 'v'
	| 'C'
	| 'c'
	| 'S'
	| 's'
	| 'Q'
	| 'q'
	| 'T'
	| 't'
	| 'A'
	| 'a'
	| 'Z'
	| 'z';

function svgCmd(cmd: SvgDCommands, x: number, y?: number) {
	let str = cmd + x;
	if (typeof y !== 'undefined') {
		str += ' ' + y;
	}

	return str;
}

function qrToPath(data: Uint8Array, size: number, margin: number) {
	let path = '';
	let moveBy = 0;
	let newRow = false;
	let lineLength = 0;

	for (let i = 0; i < data.length; i++) {
		const col = Math.floor(i % size);
		const row = Math.floor(i / size);

		if (!col && !newRow) newRow = true;

		if (data[i]) {
			lineLength++;

			if (!(i > 0 && col > 0 && data[i - 1])) {
				path += newRow ? svgCmd('M', col + margin, 0.5 + row + margin) : svgCmd('m', moveBy, 0);

				moveBy = 0;
				newRow = false;
			}

			if (!(col + 1 < size && data[i + 1])) {
				path += svgCmd('h', lineLength);
				lineLength = 0;
			}
		} else {
			moveBy++;
		}
	}

	return path;
}

export function render(
	qrData: QRCode,
	options?: Utils.QRCodeOptionsInput,
	cb?: (error: Error | null | undefined, string: string) => void
) {
	const opts = Utils.getOptions(options);
	const size = qrData.modules.size;
	const data = qrData.modules.data;
	const qrcodesize = size + opts.margin * 2;

	const bg = !opts.color.light.a
		? ''
		: '<path ' +
			getColorAttrib(opts.color.light, 'fill') +
			' d="M0 0h' +
			qrcodesize +
			'v' +
			qrcodesize +
			'H0z"/>';

	const path =
		'<path ' +
		getColorAttrib(opts.color.dark, 'stroke') +
		' d="' +
		qrToPath(data, size, opts.margin) +
		'"/>';

	const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"';

	const scale = !opts.scale
		? ''
		: 'width="' + qrcodesize * opts.scale + '" height="' + qrcodesize * opts.scale + '" ';
	const width = !opts.width ? scale : 'width="' + opts.width + '" height="' + opts.width + '" ';

	const svgTag =
		'<svg xmlns="http://www.w3.org/2000/svg" ' +
		width +
		viewBox +
		' shape-rendering="crispEdges">' +
		bg +
		path +
		'</svg>\n';

	if (typeof cb === 'function') {
		cb(null, svgTag);
	}

	return svgTag;
}
