import fs from 'fs';

import { render } from './svg-tag';
import { QRCodeToFileOptions } from './utils';
import { QRCode } from '../core/qrcode';

export { render };

export function renderToFile(
	path: string,
	qrData: QRCode,
	optionsOrCb?: QRCodeToFileOptions | ((error: Error | null) => void),
	cb?: (error: Error | null) => void
) {
	const actualOptions = typeof optionsOrCb === 'object' ? optionsOrCb : {};
	const actualCb =
		typeof cb === 'function' ? cb : typeof optionsOrCb === 'function' ? optionsOrCb : () => {};

	const svgTag = render(qrData, actualOptions);

	const xmlStr =
		'<?xml version="1.0" encoding="utf-8"?>' +
		'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
		svgTag;

	fs.writeFile(path, xmlStr, actualCb);
}
