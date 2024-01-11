import Version from '../../../lib/core/version';
import VersionCheck from '../../../lib/core/version-check';
import * as ECLevel from '../../../lib/core/error-correction-level';
import Mode from '../../../lib/core/mode';
import NumericData from '../../../lib/core/numeric-data';
import AlphanumericData from '../../../lib/core/alphanumeric-data';
import KanjiData from '../../../lib/core/kanji-data';
import ByteData from '../../../lib/core/byte-data';

const EC_LEVELS = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

const EXPECTED_NUMERIC_CAPACITY = [
	[41, 34, 27, 17],
	[77, 63, 48, 34],
	[127, 101, 77, 58],
	[187, 149, 111, 82],
	[255, 202, 144, 106],
	[322, 255, 178, 139],
	[370, 293, 207, 154],
	[461, 365, 259, 202],
	[552, 432, 312, 235],
	[652, 513, 364, 288],
	[772, 604, 427, 331],
	[883, 691, 489, 374],
	[1022, 796, 580, 427],
	[1101, 871, 621, 468],
	[1250, 991, 703, 530],
	[1408, 1082, 775, 602],
	[1548, 1212, 876, 674],
	[1725, 1346, 948, 746],
	[1903, 1500, 1063, 813],
	[2061, 1600, 1159, 919],
	[2232, 1708, 1224, 969],
	[2409, 1872, 1358, 1056],
	[2620, 2059, 1468, 1108],
	[2812, 2188, 1588, 1228],
	[3057, 2395, 1718, 1286],
	[3283, 2544, 1804, 1425],
	[3517, 2701, 1933, 1501],
	[3669, 2857, 2085, 1581],
	[3909, 3035, 2181, 1677],
	[4158, 3289, 2358, 1782],
	[4417, 3486, 2473, 1897],
	[4686, 3693, 2670, 2022],
	[4965, 3909, 2805, 2157],
	[5253, 4134, 2949, 2301],
	[5529, 4343, 3081, 2361],
	[5836, 4588, 3244, 2524],
	[6153, 4775, 3417, 2625],
	[6479, 5039, 3599, 2735],
	[6743, 5313, 3791, 2927],
	[7089, 5596, 3993, 3057],
];

const EXPECTED_ALPHANUMERIC_CAPACITY = [
	[25, 20, 16, 10],
	[47, 38, 29, 20],
	[77, 61, 47, 35],
	[114, 90, 67, 50],
	[154, 122, 87, 64],
	[195, 154, 108, 84],
	[224, 178, 125, 93],
	[279, 221, 157, 122],
	[335, 262, 189, 143],
	[395, 311, 221, 174],
	[468, 366, 259, 200],
	[535, 419, 296, 227],
	[619, 483, 352, 259],
	[667, 528, 376, 283],
	[758, 600, 426, 321],
	[854, 656, 470, 365],
	[938, 734, 531, 408],
	[1046, 816, 574, 452],
	[1153, 909, 644, 493],
	[1249, 970, 702, 557],
	[1352, 1035, 742, 587],
	[1460, 1134, 823, 640],
	[1588, 1248, 890, 672],
	[1704, 1326, 963, 744],
	[1853, 1451, 1041, 779],
	[1990, 1542, 1094, 864],
	[2132, 1637, 1172, 910],
	[2223, 1732, 1263, 958],
	[2369, 1839, 1322, 1016],
	[2520, 1994, 1429, 1080],
	[2677, 2113, 1499, 1150],
	[2840, 2238, 1618, 1226],
	[3009, 2369, 1700, 1307],
	[3183, 2506, 1787, 1394],
	[3351, 2632, 1867, 1431],
	[3537, 2780, 1966, 1530],
	[3729, 2894, 2071, 1591],
	[3927, 3054, 2181, 1658],
	[4087, 3220, 2298, 1774],
	[4296, 3391, 2420, 1852],
];

const EXPECTED_KANJI_CAPACITY = [
	[10, 8, 7, 4],
	[20, 16, 12, 8],
	[32, 26, 20, 15],
	[48, 38, 28, 21],
	[65, 52, 37, 27],
	[82, 65, 45, 36],
	[95, 75, 53, 39],
	[118, 93, 66, 52],
	[141, 111, 80, 60],
	[167, 131, 93, 74],
	[198, 155, 109, 85],
	[226, 177, 125, 96],
	[262, 204, 149, 109],
	[282, 223, 159, 120],
	[320, 254, 180, 136],
	[361, 277, 198, 154],
	[397, 310, 224, 173],
	[442, 345, 243, 191],
	[488, 384, 272, 208],
	[528, 410, 297, 235],
	[572, 438, 314, 248],
	[618, 480, 348, 270],
	[672, 528, 376, 284],
	[721, 561, 407, 315],
	[784, 614, 440, 330],
	[842, 652, 462, 365],
	[902, 692, 496, 385],
	[940, 732, 534, 405],
	[1002, 778, 559, 430],
	[1066, 843, 604, 457],
	[1132, 894, 634, 486],
	[1201, 947, 684, 518],
	[1273, 1002, 719, 553],
	[1347, 1060, 756, 590],
	[1417, 1113, 790, 605],
	[1496, 1176, 832, 647],
	[1577, 1224, 876, 673],
	[1661, 1292, 923, 701],
	[1729, 1362, 972, 750],
	[1817, 1435, 1024, 784],
];

const EXPECTED_BYTE_CAPACITY = [
	[17, 14, 11, 7],
	[32, 26, 20, 14],
	[53, 42, 32, 24],
	[78, 62, 46, 34],
	[106, 84, 60, 44],
	[134, 106, 74, 58],
	[154, 122, 86, 64],
	[192, 152, 108, 84],
	[230, 180, 130, 98],
	[271, 213, 151, 119],
	[321, 251, 177, 137],
	[367, 287, 203, 155],
	[425, 331, 241, 177],
	[458, 362, 258, 194],
	[520, 412, 292, 220],
	[586, 450, 322, 250],
	[644, 504, 364, 280],
	[718, 560, 394, 310],
	[792, 624, 442, 338],
	[858, 666, 482, 382],
	[929, 711, 509, 403],
	[1003, 779, 565, 439],
	[1091, 857, 611, 461],
	[1171, 911, 661, 511],
	[1273, 997, 715, 535],
	[1367, 1059, 751, 593],
	[1465, 1125, 805, 625],
	[1528, 1190, 868, 658],
	[1628, 1264, 908, 698],
	[1732, 1370, 982, 742],
	[1840, 1452, 1030, 790],
	[1952, 1538, 1112, 842],
	[2068, 1628, 1168, 898],
	[2188, 1722, 1228, 958],
	[2303, 1809, 1283, 983],
	[2431, 1911, 1351, 1051],
	[2563, 1989, 1423, 1093],
	[2699, 2099, 1499, 1139],
	[2809, 2213, 1579, 1219],
	[2953, 2331, 1663, 1273],
];

const EXPECTED_VERSION_BITS = [
	0x07c94, 0x085bc, 0x09a99, 0x0a4d3, 0x0bbf6, 0x0c762, 0x0d847, 0x0e60d, 0x0f928, 0x10b78, 0x1145d,
	0x12a17, 0x13532, 0x149a6, 0x15683, 0x168c9, 0x177ec, 0x18ec4, 0x191e1, 0x1afab, 0x1b08e, 0x1cc1a,
	0x1d33f, 0x1ed75, 0x1f250, 0x209d5, 0x216f0, 0x228ba, 0x2379f, 0x24b0b, 0x2542e, 0x26a64, 0x27541,
	0x28c69,
];

describe('Version validity', () => {
	it('should return false if no input', () => {
		expect(VersionCheck.isValid(undefined as unknown as number)).toBeFalsy();
	});
	it('should return false if version is not a number', () => {
		expect(VersionCheck.isValid('' as unknown as number)).toBeFalsy();
	});
	it('should return false if version is not in range', () => {
		expect(VersionCheck.isValid(0)).toBeFalsy();
		expect(VersionCheck.isValid(41)).toBeFalsy();
	});
});

describe('Version from value', () => {
	it('should return correct version from a number', () => {
		expect(Version.from(5)).toEqual(5);
	});
	it('should return correct version from a string', () => {
		expect(Version.from('5')).toEqual(5);
	});
	it('should return default value if version is invalid', () => {
		expect(Version.from(0, 1)).toEqual(1);
	});
	it('should return default value if version is undefined', () => {
		expect(Version.from(null as unknown as number, 1)).toEqual(1);
	});
});

describe('Version capacity', () => {
	it('should throw if version is undefined', () => {
		// @ts-ignore
		expect(() => Version.getCapacity()).toThrow();
	});
	it('should throw if version is not a number', () => {
		// @ts-ignore
		expect(() => Version.getCapacity('')).toThrow();
	});
	it('should throw if version is not in range', () => {
		// @ts-ignore
		expect(() => Version.getCapacity(0)).toThrow();
		// @ts-ignore
		expect(() => Version.getCapacity(41)).toThrow();
	});

	it('should return correct numeric mode capacity', () => {
		for (let l = 0; l < EC_LEVELS.length; l++) {
			for (let i = 1; i <= 40; i++) {
				// @ts-ignore
				expect(Version.getCapacity(i, EC_LEVELS[l], Mode.NUMERIC)).toEqual(
					EXPECTED_NUMERIC_CAPACITY[i - 1][l]
				);
			}
		}
	});

	it('should return correct alphanumeric mode capacity', () => {
		for (let l = 0; l < EC_LEVELS.length; l++) {
			for (let i = 1; i <= 40; i++) {
				expect(
					// @ts-ignore
					Version.getCapacity(i, EC_LEVELS[l], Mode.ALPHANUMERIC)
				).toEqual(EXPECTED_ALPHANUMERIC_CAPACITY[i - 1][l]);
			}
		}
	});

	it('should return correct kanji mode capacity', () => {
		for (let l = 0; l < EC_LEVELS.length; l++) {
			for (let i = 1; i <= 40; i++) {
				// @ts-ignore
				expect(Version.getCapacity(i, EC_LEVELS[l], Mode.KANJI)).toEqual(
					EXPECTED_KANJI_CAPACITY[i - 1][l]
				);
			}
		}
	});

	it('should return correct byte mode capacity', () => {
		for (let l = 0; l < EC_LEVELS.length; l++) {
			for (let i = 1; i <= 40; i++) {
				// @ts-ignore
				expect(Version.getCapacity(i, EC_LEVELS[l], Mode.BYTE)).toEqual(
					EXPECTED_BYTE_CAPACITY[i - 1][l]
				);
				// @ts-ignore
				expect(Version.getCapacity(i, EC_LEVELS[l])).toEqual(EXPECTED_BYTE_CAPACITY[i - 1][l]);
			}
		}
	});
});

describe('Version best match', () => {
	for (let [expectedCapacity, DataCtor] of [
		[EXPECTED_NUMERIC_CAPACITY, NumericData],
		[EXPECTED_ALPHANUMERIC_CAPACITY, AlphanumericData],
		[EXPECTED_KANJI_CAPACITY, KanjiData],
		[EXPECTED_BYTE_CAPACITY, ByteData],
	]) {
		for (let v = 0; v < 40; v++) {
			for (let l = 0; l < EC_LEVELS.length; l++) {
				// @ts-ignore
				const capacity = expectedCapacity[v][l];
				// @ts-ignore
				const data = new DataCtor(new Array(capacity + 1).join('-'));

				it('should return best version', () => {
					// @ts-ignore
					expect(Version.getBestVersionForData(data, EC_LEVELS[l])).toEqual(v + 1);
					// @ts-ignore
					expect(Version.getBestVersionForData([data], EC_LEVELS[l])).toEqual(v + 1);
				});

				if (l === 1) {
					it('should return best version for ECLevel.M if error level is undefined', () => {
						// @ts-ignore
						expect(Version.getBestVersionForData(data, null)).toEqual(v + 1);
						// @ts-ignore
						expect(Version.getBestVersionForData([data], null)).toEqual(v + 1);
					});
				}
			}
		}

		for (let i = 0; i < EC_LEVELS.length; i++) {
			// @ts-ignore
			const exceededCapacity = expectedCapacity[39][i] + 1;
			// @ts-ignore
			const tooBigData = new DataCtor(new Array(exceededCapacity + 1).join('-'));
			const tooBigDataArray = [
				// @ts-ignore
				new DataCtor(new Array(Math.floor(exceededCapacity / 2)).join('-')),
				// @ts-ignore
				new DataCtor(new Array(Math.floor(exceededCapacity / 2) + 1).join('-')),
			];

			it('should return undefined if data is too big', () => {
				// @ts-ignore
				expect(Version.getBestVersionForData(tooBigData, EC_LEVELS[i])).toBeUndefined();
				// @ts-ignore
				expect(Version.getBestVersionForData([tooBigData], EC_LEVELS[i])).toBeUndefined();
				// @ts-ignore
				expect(Version.getBestVersionForData(tooBigDataArray, EC_LEVELS[i])).toBeUndefined();
			});
		}
	}

	it('should return a version number if input array is valid', () => {
		expect(
			typeof Version.getBestVersionForData([new ByteData('abc'), new NumericData('1234')])
		).toBe('number');
	});

	it('should return 1 if array is empty', () => {
		expect(Version.getBestVersionForData([])).toEqual(1);
	});
});

describe('Version encoded info', () => {
	let v;

	it('should throw if version is invalid or less than 7', () => {
		for (let v = 0; v < 7; v++) {
			expect(() => Version.getEncodedBits(v)).toThrow();
		}
	});

	it('should return correct bits', () => {
		for (let v = 7; v <= 40; v++) {
			const bch = Version.getEncodedBits(v);
			expect(bch).toEqual(EXPECTED_VERSION_BITS[v - 7]);
		}
	});
});
