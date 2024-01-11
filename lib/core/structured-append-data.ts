import BitBuffer from './bit-buffer';
import * as Mode from './mode';

export default class StructuredAppendData {
	mode: Mode.Mode;
	data: { position: number; total: number; parity: number };
	constructor(data: { position: number; total: number; parity: number }) {
		this.mode = Mode.STRUCTURED_APPEND;
		this.data = data;
	}

	getBitsLength() {
		return 16;
	}

	static getBitsLength() {
		return 16;
	}

	getLength() {
		return 0;
	}

	write(bitBuffer: BitBuffer) {
		bitBuffer.put(this.data.position, 4);
		bitBuffer.put(this.data.total, 4);
		bitBuffer.put(this.data.parity, 8);
	}
}
