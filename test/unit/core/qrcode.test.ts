import * as ECLevel from '../../../lib/core/error-correction-level';
import * as Version from '../../../lib/core/version';
import * as QRCode from '../../../lib/core/qrcode';
import toSJIS from '../../../helper/to-sjis';
import { QRCodeSegmentInput } from '../../../lib/core/segments';

describe('QRCode interface', () => {
	it('should have create function', () => {
		expect(QRCode.create).toBeDefined();
		expect(typeof QRCode.create).toBe('function');
	});

	it('should throw if no data is provided', () => {
		expect(() => {
			QRCode.create(null as unknown as string);
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
		expect(() => QRCode.create({} as unknown as QRCodeSegmentInput[])).toThrow();
	});

	it('should accept data as string', () => {
		expect(() => QRCode.create('AAAAA00000')).not.toThrow();
	});

	it('should accept data as array of objects', () => {
		expect(() =>
			QRCode.create(
				[
					{ data: 'ABCDEFG', mode: 'Alphanumeric' },
					{ data: 'abcdefg' },
					{ data: '晒三', mode: 'Kanji' },
					{ data: '0123456', mode: 'Numeric' },
				],
				{ toSJISFunc: toSJIS }
			)
		).not.toThrow();
	});
	it('should accept errorCorrectionLevel as string', () => {
		expect(() => QRCode.create('AAAAA00000', { errorCorrectionLevel: 'quartile' })).not.toThrow();
		expect(() =>
			QRCode.create('AAAAA00000', {
				errorCorrectionLevel: 'q' as ECLevel.QRCodeErrorCorrectionLevel,
			})
		).not.toThrow();
	});
});

describe('QRCode error correction', () => {
	let qr;
	const ecValues: {
		name: ECLevel.QRCodeErrorCorrectionLevel[];
		level: ECLevel.ErrorCorrectionLevel;
	}[] = [
		{ name: ['L', 'low'], level: ECLevel.L },
		{ name: ['M', 'medium'], level: ECLevel.M },
		{ name: ['Q', 'quartile'], level: ECLevel.Q },
		{ name: ['H', 'high'], level: ECLevel.H },
	];

	for (let l = 0; l < ecValues.length; l++) {
		for (let i = 0; i < ecValues[l].name.length; i++) {
			it('should accept errorCorrectionLevel value: ' + ecValues[l].name[i], () => {
				const qr = QRCode.create('ABCDEFG', { errorCorrectionLevel: ecValues[l].name[i] });
				expect(qr.errorCorrectionLevel).toBe(ecValues[l].level);
			});

			it('should accept errorCorrectionLevel value: ' + ecValues[l].name[i].toUpperCase(), () => {
				const qr = QRCode.create('ABCDEFG', {
					errorCorrectionLevel: ecValues[l].name[
						i
					].toUpperCase() as ECLevel.QRCodeErrorCorrectionLevel,
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
		const qr = QRCode.create('data', { version: 9, errorCorrectionLevel: 'M' });
		expect(qr.version).toBe(9);
	});
	it('should set correct EC level', () => {
		const qr = QRCode.create('data', { version: 9, errorCorrectionLevel: 'M' });
		expect(qr.errorCorrectionLevel).toBe(ECLevel.M);
	});

	it('should throw if data cannot be contained with chosen version', () => {
		expect(() => {
			QRCode.create(new Array(Version.getCapacity(2, ECLevel.H)).join('a'), {
				version: 1,
				errorCorrectionLevel: 'H',
			});
		}).toThrow();
	});

	it('should throw if data cannot be contained in a qr code', () => {
		expect(() => {
			QRCode.create(new Array(Version.getCapacity(40, ECLevel.H) + 2).join('a'), {
				version: 40,
				errorCorrectionLevel: 'H',
			});
		}).toThrow();
	});

	it('should use best version if the one provided is invalid', () => {
		expect(() => {
			QRCode.create('abcdefg', { version: 'invalid' as unknown as number });
		}).not.toThrow();
	});
});

describe('QRCode capacity', () => {
	it('should contain 7 byte characters', () => {
		const qr = QRCode.create([{ data: 'abcdefg', mode: 'Byte' }]);
		expect(qr.version).toBe(1);
	});

	it('should contain 17 numeric characters', () => {
		const qr = QRCode.create([{ data: '12345678901234567', mode: 'Numeric' }]);
		expect(qr.version).toBe(1);
	});

	it('should contain 10 alphanumeric characters', () => {
		const qr = QRCode.create([{ data: 'ABCDEFGHIL', mode: 'Alphanumeric' }]);
		expect(qr.version).toBe(1);
	});

	it('should contain 4 kanji characters', () => {
		const qr = QRCode.create([{ data: 'ＡＩぐサ', mode: 'Kanji' }], { toSJISFunc: toSJIS });
		expect(qr.version).toBe(1);
	});
});
