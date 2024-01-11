import BitBuffer from './bit-buffer';
import * as Mode from './mode';

/**
 * Array of characters available in alphanumeric mode
 *
 * As per QR Code specification, to each character
 * is assigned a value from 0 to 44 which in this case coincides
 * with the array index
 *
 * @type {Array}
 */
const ALPHA_NUM_CHARS = [
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
	['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
	[' ', '$', '%', '*', '+', '-', '.', '/', ':'],
].flat();

export default class AlphanumericData {
	mode: Mode.Mode;
	data: string;
	constructor(data: string) {
		this.mode = Mode.ALPHANUMERIC;
		this.data = data;
	}

	getBitsLength() {
		return 11 * Math.floor(this.data.length / 2) + 6 * (this.data.length % 2);
	}

	getLength() {
		return this.data.length;
	}

	write(bitBuffer: BitBuffer) {
		let i;

		// Input data characters are divided into groups of two characters
		// and encoded as 11-bit binary codes.
		for (i = 0; i + 2 <= this.data.length; i += 2) {
			// The character value of the first character is multiplied by 45
			let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;

			// The character value of the second digit is added to the product
			value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);

			// The sum is then stored as 11-bit binary number
			bitBuffer.put(value, 11);
		}

		// If the number of input data characters is not a multiple of two,
		// the character value of the final character is encoded as a 6-bit binary number.
		if (this.data.length % 2) {
			bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
		}
	}
}
