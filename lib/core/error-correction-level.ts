export interface ErrorCorrectionLevel {
	bit: 0 | 1 | 2 | 3;
}

export type QRCodeErrorCorrectionLevel =
	| 'low'
	| 'medium'
	| 'quartile'
	| 'high'
	| 'L'
	| 'M'
	| 'Q'
	| 'H';

export const L: ErrorCorrectionLevel = { bit: 1 };
export const M: ErrorCorrectionLevel = { bit: 0 };
export const Q: ErrorCorrectionLevel = { bit: 3 };
export const H: ErrorCorrectionLevel = { bit: 2 };

function fromString(string: QRCodeErrorCorrectionLevel) {
	if (typeof string !== 'string') {
		throw new Error('Param is not a string');
	}

	const lcStr = string.toLowerCase();

	switch (lcStr) {
		case 'l':
		case 'low':
			return L;

		case 'm':
		case 'medium':
			return M;

		case 'q':
		case 'quartile':
			return Q;

		case 'h':
		case 'high':
			return H;

		default:
			throw new Error('Unknown EC Level: ' + string);
	}
}

export function from(
	value?: QRCodeErrorCorrectionLevel,
	defaultValue: QRCodeErrorCorrectionLevel = 'H'
): ErrorCorrectionLevel {
	try {
		return fromString(value ?? defaultValue);
	} catch (e) {
		return fromString(defaultValue);
	}
}
