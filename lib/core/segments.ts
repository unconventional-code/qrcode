import * as Mode from './mode';
import NumericData from './numeric-data';
import AlphanumericData from './alphanumeric-data';
import ByteData from './byte-data';
import KanjiData from './kanji-data';
import StructuredAppendData from './structured-append-data';
import * as Regex from './regex';
import * as Utils from './utils';
import dijkstra from 'dijkstrajs';

export interface DataSegment {
	getLength(): number;
	getBitsLength(): number;
}

type SegmentData = ByteData | NumericData | AlphanumericData | KanjiData | StructuredAppendData;

export type QRCodeSegmentMode = 'alphanumeric' | 'numeric' | 'byte' | 'kanji' | 'structuredappend';

export type QRCodeSegment = {
	mode: Mode.Mode;
	data: string;
	index: number;
	length: number;
};

/**
 * Returns UTF8 byte length
 *
 * @param  {String} inputString Input string
 * @return {Number}     Number of byte
 */
function getStringByteLength(inputString: string) {
	return unescape(encodeURIComponent(inputString)).length;
}

/**
 * Get a list of segments of the specified mode
 * from a string
 *
 * @param  {Mode}   mode Segment mode
 * @param  {String} str  String to process
 * @return {Array}       Array of object with segments data
 */
function getSegments(regex: RegExp, mode: Mode.Mode, str: string): QRCodeSegment[] {
	const segments = [];
	let result;

	while ((result = regex.exec(str)) !== null) {
		segments.push({
			data: result[0],
			index: result.index,
			mode: mode,
			length: result[0].length,
		});
	}

	return segments;
}

/**
 * Extracts a series of segments with the appropriate
 * modes from a string
 *
 * @param  {String} dataStr Input string
 * @return {Array}          Array of object with segments data
 */
function getSegmentsFromString(dataStr: string) {
	const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
	const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
	let byteSegs: QRCodeSegment[];
	let kanjiSegs: QRCodeSegment[];

	if (Utils.isKanjiModeEnabled()) {
		byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
		kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
	} else {
		byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
		kanjiSegs = [];
	}

	const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

	return segs.sort(function (s1, s2) {
		return s1.index - s2.index;
	});
	// .map(function (obj) {
	// 	return {
	// 		data: obj.data,
	// 		mode: obj.mode,
	// 		length: obj.length,
	// 	};
	// });
}

/**
 * Returns how many bits are needed to encode a string of
 * specified length with the specified mode
 *
 * @param  {Number} length String length
 * @param  {Mode} mode     Segment mode
 * @return {Number}        Bit length
 */
function getSegmentBitsLength(stringLength: number, mode: Mode.Mode) {
	switch (mode) {
		case Mode.NUMERIC:
			return NumericData.getBitsLength(stringLength);
		case Mode.ALPHANUMERIC:
			return AlphanumericData.getBitsLength(stringLength);
		case Mode.KANJI:
			return KanjiData.getBitsLength(stringLength);
		case Mode.BYTE:
			return ByteData.getBitsLength(stringLength);
		case Mode.STRUCTURED_APPEND:
			return StructuredAppendData.getBitsLength();
		default:
			throw new Error('Invalid mode: ' + mode);
	}
}

/**
 * Merges adjacent segments which have the same mode
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function mergeSegments(segs: GraphSegment[]) {
	return segs.reduce(function (acc: GraphSegment[], curr) {
		const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
		if (prevSeg && prevSeg.mode === curr.mode) {
			acc[acc.length - 1].data += curr.data as string;
			return acc;
		}

		acc.push(curr);
		return acc;
	}, []);
}

/**
 * Generates a list of all possible nodes combination which
 * will be used to build a segments graph.
 *
 * Nodes are divided by groups. Each group will contain a list of all the modes
 * in which is possible to encode the given text.
 *
 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
 * The group for '12345' will contain then 3 objects, one for each
 * possible encoding mode.
 *
 * Each node represents a possible segment.
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function buildNodes(segs: QRCodeSegment[]) {
	const nodes = [];
	for (let i = 0; i < segs.length; i++) {
		const seg = segs[i];

		switch (seg.mode) {
			case Mode.NUMERIC:
				nodes.push([
					seg,
					{ data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
					{ data: seg.data, mode: Mode.BYTE, length: seg.length },
				]);
				break;
			case Mode.ALPHANUMERIC:
				nodes.push([seg, { data: seg.data, mode: Mode.BYTE, length: seg.length }]);
				break;
			case Mode.KANJI:
				nodes.push([
					seg,
					{ data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data.toString()) },
				]);
				break;
			case Mode.BYTE:
				nodes.push([
					{ data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data.toString()) },
				]);
		}
	}

	return nodes;
}

type GraphSegment = {
	data: string;
	mode: Mode.Mode;
	length: number;
};

/**
 * Builds a graph from a list of nodes.
 * All segments in each node group will be connected with all the segments of
 * the next group and so on.
 *
 * At each connection will be assigned a weight depending on the
 * segment's byte length.
 *
 * @param  {Array} nodes    Array of object with segments data
 * @param  {Number} version QR Code version
 * @return {Object}         Graph of all possible segments
 */
function buildGraph(nodes: GraphSegment[][], qrCodeVersion: number) {
	const table: Record<
		string,
		{
			node: GraphSegment;
			lastCount: number;
		}
	> = {};
	const graph: Record<string, Record<string, number>> = { start: {} };
	let prevNodeIds = ['start'];

	for (let i = 0; i < nodes.length; i++) {
		const nodeGroup = nodes[i];
		const currentNodeIds = [];

		for (let j = 0; j < nodeGroup.length; j++) {
			const node = nodeGroup[j];
			const key = '' + i + j;

			currentNodeIds.push(key);
			table[key] = { node: node, lastCount: 0 };
			graph[key] = {};

			for (let n = 0; n < prevNodeIds.length; n++) {
				const prevNodeId = prevNodeIds[n];

				if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
					graph[prevNodeId][key] =
						getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
						getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

					table[key].lastCount += node.length;
				} else {
					graph[prevNodeId][key] =
						getSegmentBitsLength(node.length, node.mode) +
						4 +
						Mode.getCharCountIndicator(node.mode, qrCodeVersion); // switch cost

					table[key].lastCount = node.length;
				}
			}
		}

		prevNodeIds = currentNodeIds;
	}

	for (let n = 0; n < prevNodeIds.length; n++) {
		graph[prevNodeIds[n]].end = 0;
	}

	return { map: graph, table: table };
}

/**
 * Builds a segment from a specified data and mode.
 * If a mode is not specified, the more suitable will be used.
 *
 * @param  {String} data             Input data
 * @param  {Mode | String} modesHint Data mode
 * @return {Segment}                 Segment
 */
function buildSingleSegment(data: string, modesHint?: Mode.Mode | string): SegmentData {
	const bestMode = Mode.getBestModeForData(data);

	let mode = modesHint ? Mode.from(modesHint, bestMode) : bestMode;

	// Make sure data can be encoded
	if (mode !== Mode.BYTE && mode !== Mode.STRUCTURED_APPEND && mode.bit < bestMode.bit) {
		throw new Error(
			'"' +
				data +
				'"' +
				' cannot be encoded with mode ' +
				Mode.toString(mode) +
				'.\n Suggested mode is: ' +
				Mode.toString(bestMode)
		);
	}

	// Use Mode.BYTE if Kanji support is disabled
	if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
		mode = Mode.BYTE;
	}

	switch (mode) {
		case Mode.NUMERIC:
			return new NumericData(data);

		case Mode.ALPHANUMERIC:
			return new AlphanumericData(data);

		case Mode.KANJI:
			return new KanjiData(data);

		case Mode.BYTE:
			return new ByteData(data);

		case Mode.STRUCTURED_APPEND:
			// TODO: Add better support for structured append data
			return new StructuredAppendData(data as unknown as StructuredAppendData['data']);

		default:
			throw new Error('Invalid mode: ' + mode);
	}
}

/**
 * Builds a list of segments from an array.
 * Array can contain Strings or Objects with segment's info.
 *
 * For each item which is a string, will be generated a segment with the given
 * string and the more appropriate encoding mode.
 *
 * For each item which is an object, will be generated a segment with the given
 * data and mode.
 * Objects must contain at least the property "data".
 * If property "mode" is not present, the more suitable mode will be used.
 *
 * @param  {Array} array Array of objects with segments data
 * @return {Array}       Array of Segments
 */
export function fromArray(array: (GraphSegment | string)[]): SegmentData[] {
	return array.reduce(function (acc: SegmentData[], seg) {
		if (typeof seg === 'string') {
			acc.push(buildSingleSegment(seg));
		} else if (seg.data) {
			acc.push(buildSingleSegment(seg.data, seg.mode));
		}

		return acc;
	}, []);
}

/**
 * Builds an optimized sequence of segments from a string,
 * which will produce the shortest possible bitstream.
 *
 * @param  {String} data    Input string
 * @param  {Number} version QR Code version
 * @return {Array}          Array of segments
 */
export function fromString(inputString: string, qrCodeVersion: number) {
	const segs = getSegmentsFromString(inputString);

	const nodes = buildNodes(segs);
	const graph = buildGraph(nodes, qrCodeVersion);
	const path = dijkstra.find_path(graph.map, 'start', 'end');

	const optimizedSegs: GraphSegment[] = [];
	for (let i = 1; i < path.length - 1; i++) {
		optimizedSegs.push(graph.table[path[i]].node);
	}

	return fromArray(mergeSegments(optimizedSegs));
}

/**
 * Splits a string in various segments with the modes which
 * best represent their content.
 * The produced segments are far from being optimized.
 * The output of this function is only used to estimate a QR Code version
 * which may contain the data.
 *
 * @param  {string} data Input string
 * @return {Array}       Array of segments
 */
export function rawSplit(inputString: string): SegmentData[] {
	return fromArray(getSegmentsFromString(inputString));
}
