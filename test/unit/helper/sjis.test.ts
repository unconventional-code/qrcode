import toSJIS from '../../../helper/to-sjis';

describe('SJIS from char', () => {
	it('should return undefined if character is invalid', () => {
		expect(toSJIS('')).toBeUndefined()
	})

	it('should return undefined if character is not a kanji', () => {
		expect(toSJIS('A')).toBeUndefined()
	})

	it('should return correct SJIS value', () => {
		expect(toSJIS('襦')).toEqual(0xe640);
	})

	it('should return correct SJIS value', () => {
		expect(toSJIS('￢')).toEqual(0x81ca)
	})

	it('should return correct SJIS value', () => {
		expect(toSJIS('≧')).toEqual(0x8186);
	})

	it('should return correct SJIS value', () => {
		expect(toSJIS('⊥')).toEqual(0x81db);
	})

	it('should return correct SJIS value', () => {
		expect(toSJIS('愛')).toEqual(0x88a4);
	})

	it('should return correct SJIS value', () => {
		expect(toSJIS('衣')).toEqual(0x88df);
	})

	it('should return correct SJIS value', () => {
		expect(toSJIS('蔭')).toEqual(0x88fc);
	})
});
