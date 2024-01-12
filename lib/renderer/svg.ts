// @ts-nocheck
import fs from 'fs';

import { QRCodeToFileOptions } from '../../types';
import { render } from './svg-tag';
import { QRCodeSegment } from '../core/segments';

export { render };

export function renderToFile(
	path: string,
	qrData: string | QRCodeSegment[],
	options: QRCodeToFileOptions,
	cb?: (error: Error | null | undefined) => void
) {
	if (typeof cb === 'undefined') {
		cb = options;
		options = undefined;
	}

	const svgTag = render(qrData, options);

	const xmlStr =
		'<?xml version="1.0" encoding="utf-8"?>' +
		'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
		svgTag;

	fs.writeFile(path, xmlStr, cb);
}
