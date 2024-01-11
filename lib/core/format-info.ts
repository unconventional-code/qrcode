import { ErrorCorrectionLevel } from './error-correction-level';
import { getBCHDigit } from './utils';

const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
const G15_BCH = getBCHDigit(G15);

/**
 * Returns format information with relative error correction bits
 *
 * The format information is a 15-bit sequence containing 5 data bits,
 * with 10 error correction bits calculated using the (15, 5) BCH code.
 *
 * @return Encoded format information bits
 */
export function getEncodedBits(errorCorrectionLevel: ErrorCorrectionLevel, maskPattern: number) {
	const encodedFormatInformationBits = (errorCorrectionLevel.bit << 3) | maskPattern;
	let d = encodedFormatInformationBits << 10;

	while (getBCHDigit(d) - G15_BCH >= 0) {
		d ^= G15 << (getBCHDigit(d) - G15_BCH);
	}

	// xor final data with mask pattern in order to ensure that
	// no combination of Error Correction Level and data mask pattern
	// will result in an all-zero data string
	return ((encodedFormatInformationBits << 10) | d) ^ G15_MASK;
}
