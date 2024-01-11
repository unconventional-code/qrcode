import BitBuffer from './bit-buffer';
import * as Mode from './mode';

export default class ByteData {
	mode: Mode.Mode;
	data: Uint8Array;
	constructor(data: string | Uint8Array | Uint8ClampedArray | number[]) {
		this.mode = Mode.BYTE;
		if (typeof data === 'string') {
			this.data = new TextEncoder().encode(data);
		} else {
			this.data = new Uint8Array(data);
		}
	}

	getBitsLength() {
		return this.data.length * 8;
	}

	getLength() {
		return this.data.length;
	}

	write(bitBuffer: BitBuffer) {
		for (let i = 0, l = this.data.length; i < l; i++) {
			bitBuffer.put(this.data[i], 8);
		}
	}
}
