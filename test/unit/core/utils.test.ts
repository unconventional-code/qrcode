import Utils from '../../../lib/core/utils'

/**
 * QR Code sizes. Each element refers to a version
 * @type {Array}
 */
const EXPECTED_SYMBOL_SIZES = [
  21, 25, 29, 33, 37, 41, 45,
  49, 53, 57, 61, 65, 69, 73,
  77, 81, 85, 89, 93, 97, 101,
  105, 109, 113, 117, 121, 125,
  129, 133, 137, 141, 145, 149,
  153, 157, 161, 165, 169, 173, 177]

describe('Symbol size', () => {
  it('should throw if version is undefined', () => {
    // @ts-ignore
    expect(() => Utils.getSymbolSize()).toThrow()
  });
  it('should throw if version is not in range', () => {
    expect(() => Utils.getSymbolSize(0)).toThrow()
    expect(() => Utils.getSymbolSize(41)).toThrow()
  });
  it('should return correct symbol size', () => {
    for (let i = 1; i <= 40; i++) {
      expect(Utils.getSymbolSize(i)).toEqual(EXPECTED_SYMBOL_SIZES[i - 1])
    }
  })
})

describe('Symbol codewords', () => {
  it('should return positive number', () => {
    for (let i = 1; i <= 40; i++) {
      expect(Utils.getSymbolTotalCodewords(i)).toBeGreaterThan(0);
    }
  });
})

describe('BCH Digit', () => {
  const testData = [
    { data: 0, bch: 0 },
    { data: 1, bch: 1 },
    { data: 2, bch: 2 },
    { data: 4, bch: 3 },
    { data: 8, bch: 4 }
  ]

  it('should return correct BCH digit', () => {
    testData.forEach(function (d) {
      expect(Utils.getBCHDigit(d.data)).toEqual(d.bch)
    })
  });
})

describe('Set/Get SJIS function', () => {
  it('should throw if param is not a function', () => {
    expect(() => Utils.setToSJISFunction()).toThrow()
  })

  it('should disable Kanji mode if "toSJIS" function is not set', () => {
    expect(Utils.isKanjiModeEnabled()).toBeFalsy()
  })


  const testFunc = function testFunc (c: any) {
    return 'test_' + c
  }

  it('should enable Kanji mode if "toSJIS" function is set', () => {
    Utils.setToSJISFunction(testFunc)
    expect(Utils.isKanjiModeEnabled()).toBeTruthy()
  });

  it('should correctly call "toSJIS" function', () => {
    Utils.setToSJISFunction(testFunc)
    expect(Utils.toSJIS('a')).toEqual('test_a')
  })
})
