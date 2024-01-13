import { QRCode } from '../core/qrcode';
import * as big from './terminal/terminal';
import * as small from './terminal/terminal-small';
import { QRCodeToStringOptionsTerminal } from './utils';

export function render(
	qrData: QRCode,
	options?: QRCodeToStringOptionsTerminal,
	cb?: (error: Error | null | undefined, string: string) => void
) {
	if (options && options.small) {
		return small.render(qrData, options, cb);
	}
	return big.render(qrData, options, cb);
}
