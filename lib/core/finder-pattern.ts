import { getSymbolSize } from './utils';

const FINDER_PATTERN_SIZE = 7;

/**
 * Returns an array containing the positions of each finder pattern.
 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
 *
 * @return Array of coordinates
 */
export function getPositions(qrCodeVersion: number): [number, number][] {
	const size = getSymbolSize(qrCodeVersion);

	return [
		// top-left
		[0, 0],
		// top-right
		[size - FINDER_PATTERN_SIZE, 0],
		// bottom-left
		[0, size - FINDER_PATTERN_SIZE],
	];
}
