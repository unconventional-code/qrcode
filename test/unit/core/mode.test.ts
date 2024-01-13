import * as Mode from '../../../lib/core/mode';

describe('Mode', () => {
	describe('Mode bits', () => {
		it('has mode bits', () => {
			const EXPECTED_BITS = {
				numeric: 1,
				alphanumeric: 2,
				byte: 4,
				kanji: 8,
				structuredappend: 3,
				mixed: -1,
			};

			expect(Mode.NUMERIC.bit).toEqual(EXPECTED_BITS.numeric);
			expect(Mode.ALPHANUMERIC.bit).toEqual(EXPECTED_BITS.alphanumeric);
			expect(Mode.BYTE.bit).toEqual(EXPECTED_BITS.byte);
			expect(Mode.KANJI.bit).toEqual(EXPECTED_BITS.kanji);
			expect(Mode.STRUCTURED_APPEND.bit).toEqual(EXPECTED_BITS.structuredappend);
			expect(Mode.MIXED.bit).toEqual(EXPECTED_BITS.mixed);
		});
	});

	describe('Char bits', () => {
		it('has Char count bits', () => {
			const EXPECTED_BITS = {
				numeric: [10, 12, 14],
				alphanumeric: [9, 11, 13],
				byte: [8, 16, 16],
				kanji: [8, 10, 12],
				structuredappend: [0, 0, 0],
			};

			let v;
			for (v = 1; v < 10; v++) {
				expect(Mode.getCharCountIndicator(Mode.NUMERIC, v)).toEqual(EXPECTED_BITS.numeric[0]);
				expect(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v)).toEqual(
					EXPECTED_BITS.alphanumeric[0]
				);
				expect(Mode.getCharCountIndicator(Mode.BYTE, v)).toEqual(EXPECTED_BITS.byte[0]);
				expect(Mode.getCharCountIndicator(Mode.KANJI, v)).toEqual(EXPECTED_BITS.kanji[0]);
				expect(Mode.getCharCountIndicator(Mode.STRUCTURED_APPEND, v)).toEqual(
					EXPECTED_BITS.structuredappend[0]
				);
			}

			for (v = 10; v < 27; v++) {
				expect(Mode.getCharCountIndicator(Mode.NUMERIC, v)).toEqual(EXPECTED_BITS.numeric[1]);
				expect(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v)).toEqual(
					EXPECTED_BITS.alphanumeric[1]
				);
				expect(Mode.getCharCountIndicator(Mode.BYTE, v)).toEqual(EXPECTED_BITS.byte[1]);
				expect(Mode.getCharCountIndicator(Mode.KANJI, v)).toEqual(EXPECTED_BITS.kanji[1]);
				expect(Mode.getCharCountIndicator(Mode.STRUCTURED_APPEND, v)).toEqual(
					EXPECTED_BITS.structuredappend[1]
				);
			}

			for (v = 27; v <= 40; v++) {
				expect(Mode.getCharCountIndicator(Mode.NUMERIC, v)).toEqual(EXPECTED_BITS.numeric[2]);
				expect(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v)).toEqual(
					EXPECTED_BITS.alphanumeric[2]
				);
				expect(Mode.getCharCountIndicator(Mode.BYTE, v)).toEqual(EXPECTED_BITS.byte[2]);
				expect(Mode.getCharCountIndicator(Mode.KANJI, v)).toEqual(EXPECTED_BITS.kanji[2]);
				expect(Mode.getCharCountIndicator(Mode.STRUCTURED_APPEND, v)).toEqual(
					EXPECTED_BITS.structuredappend[2]
				);
			}
		});

		it('should throw if mode is invalid', () => {
			expect(() => Mode.getCharCountIndicator({} as Mode.Mode, 1)).toThrow();
		});
		it('should throw if version is invalid', () => {
			expect(() => Mode.getCharCountIndicator(Mode.BYTE, 0)).toThrow();
		});
	});

	describe('Best mode', () => {
		/* eslint-disable quote-props */
		const EXPECTED_MODE = {
			12345: Mode.NUMERIC,
			abcde: Mode.BYTE,
			'1234a': Mode.BYTE,
			ABCDa: Mode.BYTE,
			ABCDE: Mode.ALPHANUMERIC,
			'12ABC': Mode.ALPHANUMERIC,
			乂ЁЖぞβ: Mode.KANJI,
			ΑΒΓψωЮЯабв: Mode.KANJI,
			皿a晒三: Mode.BYTE,
		} as const;

		it('should return the best mode for data', () => {
			Object.keys(EXPECTED_MODE).forEach(function (data) {
				expect(Mode.getBestModeForData(data)).toEqual(
					EXPECTED_MODE[data as keyof typeof EXPECTED_MODE]
				);
			});
		});
	});

	describe('From value', () => {
		const modes: { name: Mode.ModeId; mode: Mode.Mode }[] = [
			{ name: 'Numeric', mode: Mode.NUMERIC },
			{ name: 'Alphanumeric', mode: Mode.ALPHANUMERIC },
			{ name: 'Kanji', mode: Mode.KANJI },
			{ name: 'Byte', mode: Mode.BYTE },
			{ name: 'StructuredAppend', mode: Mode.STRUCTURED_APPEND },
		];

		it('should return mode from value', () => {
			for (let m = 0; m < modes.length; m++) {
				expect(Mode.from(modes[m].name)).toEqual(modes[m].mode);
				expect(Mode.from(modes[m].name.toUpperCase() as Mode.ModeId)).toEqual(modes[m].mode);
			}
		});

		it('should return default value if mode is invalid', () => {
			expect(Mode.from('' as Mode.ModeId, 'Numeric')).toEqual(Mode.NUMERIC);
		});

		it('should return default value if mode is undefined', () => {
			expect(Mode.from(null as unknown as Mode.ModeId, 'Numeric')).toEqual(Mode.NUMERIC);
		});
	});
});
