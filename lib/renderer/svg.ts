import fs from 'fs';

import { render } from './svg-tag';

export function renderToFile(path: string, qrData: string, options) {
	const svgTag = render(qrData, options);

	const xmlStr =
		'<?xml version="1.0" encoding="utf-8"?>' +
		'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
		svgTag;

	fs.writeFileSync(path, xmlStr);
}

export { render };
