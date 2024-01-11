import * as pattern from '../../../lib/core/finder-pattern';

describe('Finder pattern', () => {
	it('should always return 3 pattern positions', () => {
		for (let i = 1; i <= 40; i++) {
			expect(pattern.getPositions(i).length).toEqual(3);
		}
	});
});
