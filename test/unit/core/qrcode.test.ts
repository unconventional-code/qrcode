// @ts-nocheck
import * as ECLevel from '../../../lib/core/error-correction-level';
import Version from '../../../lib/core/version';
import * as QRCode from '../../../lib/core/qrcode';
import toSJIS from '../../../helper/to-sjis';

describe('QRCode interface', () => {
	it('should have create function', () => {
		expect(QRCode.create).toBeDefined();
		expect(typeof QRCode.create).toBe('function');
	});

	it('should throw if no data is provided', () => {
		expect(() => {
			QRCode.create();
		}).toThrow();
	});

	it('should not throw if data is provided', () => {
		expect(() => {
			QRCode.create('1234567');
		}).not.toThrow();
	});

	let qr = QRCode.create('a123456A', {
		version: 1,
		maskPattern: 1,
		errorCorrectionLevel: 'H',
	});
	it('should return correct modules count', () => {
		expect(qr.modules.size).toBe(21);
	});
	it('should return correct mask pattern', () => {
		expect(qr.maskPattern).toBe(1);
	});

	it('should have a dark module at coords [size-8][8]', () => {
		const darkModule = qr.modules.get(qr.modules.size - 8, 8);
		expect(darkModule).toBeTruthy();
	});

	it('should throw if invalid data is passed', () => {
		expect(() => QRCode.create({})).toThrow();
	});

	it('should accept data as string', () => {
		expect(() => QRCode.create('AAAAA00000')).not.toThrow();
	});

	it('should accept data as array of objects', () => {
		expect(() =>
			QRCode.create(
				[
					{ data: 'ABCDEFG', mode: 'alphanumeric' },
					{ data: 'abcdefg' },
					{ data: '晒三', mode: 'kanji' },
					{ data: '0123456', mode: 'numeric' },
				],
				{ toSJISFunc: toSJIS }
			)
		).not.toThrow();
	});
	it('should accept errorCorrectionLevel as string', () => {
		expect(() => QRCode.create('AAAAA00000', { errorCorrectionLevel: 'quartile' })).not.toThrow();
		expect(() => QRCode.create('AAAAA00000', { errorCorrectionLevel: 'q' })).not.toThrow();
	});
});

describe('QRCode error correction', () => {
	let qr;
	const ecValues = [
		{ name: ['l', 'low'], level: ECLevel.L },
		{ name: ['m', 'medium'], level: ECLevel.M },
		{ name: ['q', 'quartile'], level: ECLevel.Q },
		{ name: ['h', 'high'], level: ECLevel.H },
	];

	for (let l = 0; l < ecValues.length; l++) {
		for (let i = 0; i < ecValues[l].name.length; i++) {
			it('should accept errorCorrectionLevel value: ' + ecValues[l].name[i], () => {
				const qr = QRCode.create('ABCDEFG', { errorCorrectionLevel: ecValues[l].name[i] });
				expect(qr.errorCorrectionLevel).toBe(ecValues[l].level);
			});

			it('should accept errorCorrectionLevel value: ' + ecValues[l].name[i].toUpperCase(), () => {
				const qr = QRCode.create('ABCDEFG', {
					errorCorrectionLevel: ecValues[l].name[i].toUpperCase(),
				});
				expect(qr.errorCorrectionLevel).toBe(ecValues[l].level);
			});
		}
	}

	it('should set default EC level to M', () => {
		const qr = QRCode.create('ABCDEFG');
		expect(qr.errorCorrectionLevel).toBe(ECLevel.M);
	});
});

describe('QRCode version', () => {
	it('should create qrcode with correct version', () => {
		const qr = QRCode.create('data', { version: 9, errorCorrectionLevel: ECLevel.M });
		expect(qr.version).toBe(9);
	});
	it('should set correct EC level', () => {
		const qr = QRCode.create('data', { version: 9, errorCorrectionLevel: ECLevel.M });
		expect(qr.errorCorrectionLevel).toBe(ECLevel.M);
	});

	it('should throw if data cannot be contained with chosen version', () => {
		expect(() => {
			QRCode.create(new Array(Version.getCapacity(2, ECLevel.H)).join('a'), {
				version: 1,
				errorCorrectionLevel: ECLevel.H,
			});
		}).toThrow();
	});

	it('should throw if data cannot be contained in a qr code', () => {
		expect(() => {
			QRCode.create(new Array(Version.getCapacity(40, ECLevel.H) + 2).join('a'), {
				version: 40,
				errorCorrectionLevel: ECLevel.H,
			});
		}).toThrow();
	});

	it('should use best version if the one provided is invalid', () => {
		expect(() => {
			QRCode.create('abcdefg', { version: 'invalid' });
		}).not.toThrow();
	});
});

describe('QRCode capacity', () => {
	it('should contain 7 byte characters', () => {
		const qr = QRCode.create([{ data: 'abcdefg', mode: 'byte' }]);
		expect(qr.version).toBe(1);
	});

	it('should contain 17 numeric characters', () => {
		const qr = QRCode.create([{ data: '12345678901234567', mode: 'numeric' }]);
		expect(qr.version).toBe(1);
	});

	it('should contain 10 alphanumeric characters', () => {
		const qr = QRCode.create([{ data: 'ABCDEFGHIL', mode: 'alphanumeric' }]);
		expect(qr.version).toBe(1);
	});

	it('should contain 4 kanji characters', () => {
		const qr = QRCode.create([{ data: 'ＡＩぐサ', mode: 'kanji' }], { toSJISFunc: toSJIS });
		expect(qr.version).toBe(1);
	});
});
