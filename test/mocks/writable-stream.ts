import stream from 'stream';

export default class WritableStream extends stream.Writable {
	forceError: boolean;
	constructor() {
		super();
		stream.Writable.call(this);
		this.forceError = false;

		this.once('finish', () => {
			this.close();
		});
	}

	_write(_data: unknown, _encoding: unknown, cb: (forceError: Error | null) => void) {
		if (this.forceError) {
			this.emit('error', new Error('Fake error'));
			cb(new Error());
		} else {
			cb(null);
		}
	}

	close(cb?: () => void) {
		this.emit('close');
		if (cb) {
			cb();
		}
	}

	forceErrorOnWrite() {
		this.forceError = true;
		return this;
	}
}
