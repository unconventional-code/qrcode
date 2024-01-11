import fs from 'fs';
import * as htmlparser from 'htmlparser2';
import * as QRCode from '../../../lib/core/qrcode';
import SvgRenderer from '../../../lib/renderer/svg';

function getExpectedViewbox(size: number, margin: number) {
	const expectedQrCodeSize = size + margin * 2;
	return '0 0 ' + expectedQrCodeSize + ' ' + expectedQrCodeSize;
}

async function testSvgFragment(svgFragment: any, expectedTags: any[]): Promise<any[]> {
	const tagsNamesAndAttribs: any[] = [];
	return new Promise(function (resolve, reject) {
		const parser = new htmlparser.Parser(
			{
				onopentag: function (name, attribs) {
					const tag = expectedTags.shift();
					tagsNamesAndAttribs.push({ tag, name, attribs });
				},

				onend: function () {
					resolve(tagsNamesAndAttribs);
				},

				onerror: function (e) {
					reject(e);
				},
			},
			{ decodeEntities: true }
		);

		parser.write(svgFragment);
		parser.end();
	});
}

async function buildTest(data: any, opts: any, expectedTags: any[]) {
	const svg = SvgRenderer.render(data, opts);
	return await testSvgFragment(svg, expectedTags.slice());
}

describe('svgrender interface', () => {
	it('should have render function', () => {
		expect(SvgRenderer.render).toBeDefined();
		expect(typeof SvgRenderer.render).toBe('function');
	});

	it('should have renderToFile function', () => {
		expect(SvgRenderer.renderToFile).toBeDefined();
		expect(typeof SvgRenderer.renderToFile).toBe('function');
	});
});

describe('Svg render', () => {
	const tests = [];

	// @ts-ignore
	const data = QRCode.create('sample text', { version: 2 });
	// @ts-ignore
	const size = data.modules.size;

	describe('render test case 1', () => {
		it('should have the correct tags, attributes, and attribute values', async () => {
			const tagsNamesAndAttribs = await buildTest(
				data,
				{
					scale: 4,
					margin: 4,
					color: {
						light: '#ffffff80',
					},
				},
				[
					{
						name: 'svg',
						attribs: [{ name: 'viewbox', value: getExpectedViewbox(size, 4) }],
					},
					{
						name: 'path',
						attribs: [
							{ name: 'fill', value: '#ffffff' },
							{ name: 'fill-opacity', value: '.50' },
						],
					},
					{
						name: 'path',
						attribs: [{ name: 'stroke', value: '#000000' }],
					},
				]
			);

			tagsNamesAndAttribs.forEach(({ tag, name, attribs }) => {
				expect(tag.name).toEqual(name);

				tag.attribs.forEach(function (attr: any) {
					expect(attribs[attr.name]).toEqual(attr.value.toString());
				});
			});
		});
	});

	describe('render test case 2', () => {
		it('should have the correct tags, attributes, and attribute values', async () => {
			const tagsNamesAndAttribs = await buildTest(
				data,
				{
					scale: 0,
					margin: 8,
					color: {
						light: '#0000',
						dark: '#00000080',
					},
				},
				[
					{
						name: 'svg',
						attribs: [{ name: 'viewbox', value: getExpectedViewbox(size, 8) }],
					},
					{
						name: 'path',
						attribs: [
							{ name: 'stroke', value: '#000000' },
							{ name: 'stroke-opacity', value: '.50' },
						],
					},
				]
			);

			tagsNamesAndAttribs.forEach(({ tag, name, attribs }) => {
				expect(tag.name).toEqual(name);

				tag.attribs.forEach(function (attr: any) {
					expect(attribs[attr.name]).toEqual(attr.value.toString());
				});
			});
		});
	});

	describe('render test case 3', () => {
		it('should have the correct tags, attributes, and attribute values', async () => {
			const tagsNamesAndAttribs = await buildTest(data, {}, [
				{
					name: 'svg',
					attribs: [{ name: 'viewbox', value: getExpectedViewbox(size, 4) }],
				},
				{ name: 'path', attribs: [{ name: 'fill', value: '#ffffff' }] },
				{ name: 'path', attribs: [{ name: 'stroke', value: '#000000' }] },
			]);

			tagsNamesAndAttribs.forEach(({ tag, name, attribs }) => {
				expect(tag.name).toEqual(name);

				tag.attribs.forEach(function (attr: any) {
					expect(attribs[attr.name]).toEqual(attr.value.toString());
				});
			});
		});
	});

	describe('render test case 4', () => {
		it('should have the correct tags, attributes, and attribute values', async () => {
			const tagsNamesAndAttribs = await buildTest(data, { width: 250 }, [
				{
					name: 'svg',
					attribs: [
						{ name: 'width', value: '250' },
						{ name: 'height', value: '250' },
						{ name: 'viewbox', value: getExpectedViewbox(size, 4) },
					],
				},
				{ name: 'path', attribs: [{ name: 'fill', value: '#ffffff' }] },
				{ name: 'path', attribs: [{ name: 'stroke', value: '#000000' }] },
			]);

			tagsNamesAndAttribs.forEach(({ tag, name, attribs }) => {
				expect(tag.name).toEqual(name);

				tag.attribs.forEach(function (attr: any) {
					expect(attribs[attr.name]).toEqual(attr.value.toString());
				});
			});
		});
	});
});

describe('Svg renderToFile', () => {
	// @ts-ignore
	const sampleQrData = QRCode.create('sample text', { version: 2 });
	const fileName = 'qrimage.svg';

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should not generate errors with only qrData param', () => {
		SvgRenderer.renderToFile(fileName, sampleQrData, function (err: any) {
			expect(err).toBeFalsy();
		});
	});

	it('should save file with correct file name', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {});

		SvgRenderer.renderToFile(fileName, sampleQrData, function (err: any) {
			expect(fsSpy).toHaveBeenCalledWith(fileName);
		});
	});

	it('should not generate errors with options param', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {});

		SvgRenderer.renderToFile(
			fileName,
			sampleQrData,
			{
				margin: 10,
				scale: 1,
			},
			function (err: any) {
				expect(err).toBeFalsy();
			}
		);
	});

	it('should save file with correct file name', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {});

		SvgRenderer.renderToFile(
			fileName,
			sampleQrData,
			{
				margin: 10,
				scale: 1,
			},
			function (err: any) {
				expect(fsSpy).toHaveBeenCalledWith(fileName);
			}
		);
	});

	it('should fail if error occurs during save', () => {
		const fsSpy = jest.spyOn(fs, 'writeFile');
		fsSpy.mockImplementation((path, data, cb) => {
			cb(new Error());
		});

		SvgRenderer.renderToFile(fileName, sampleQrData, function (err: any) {
			expect(err).toBeTruthy();
		});
	});
});
