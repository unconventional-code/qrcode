import { QRCode, QRCodeOptions } from '../core/qrcode';

export type QRCodeDataURLType = 'image/png' | 'image/jpeg' | 'image/webp';
export type QRCodeStringType = 'utf8' | 'svg' | 'terminal';
export type QRCodeToStringOptions = QRCodeToStringOptionsTerminal | QRCodeToStringOptionsOther;
export type QRCodeToDataURLOptions = QRCodeToDataURLOptionsJpegWebp | QRCodeToDataURLOptionsOther;

export interface QRCodeRenderersOptions extends QRCodeOptions {
	/**
	 * Define how much wide the quiet zone should be.
	 * @default 4
	 */
	margin?: number | undefined;
	/**
	 * Scale factor. A value of `1` means 1px per modules (black dots).
	 * @default 4
	 */
	scale?: number | undefined;
	/**
	 * Forces a specific width for the output image.
	 * If width is too small to contain the qr symbol, this option will be ignored.
	 * Takes precedence over `scale`.
	 */
	width?: number | undefined;
	color?:
		| {
				/**
				 * Color of dark module. Value must be in hex format (RGBA).
				 * Note: dark color should always be darker than `color.light`.
				 * @default '#000000ff'
				 */
				dark?: string | undefined;
				/**
				 * Color of light module. Value must be in hex format (RGBA).
				 * @default '#ffffffff'
				 */
				light?: string | undefined;
		  }
		| undefined;
}

export interface QRCodeToDataURLOptionsJpegWebp extends QRCodeRenderersOptions {
	/**
	 * Data URI format.
	 * @default 'image/png'
	 */
	type: 'image/jpeg' | 'image/webp';
	rendererOpts?:
		| {
				/**
				 * A number between `0` and `1` indicating image quality.
				 * @default 0.92
				 */
				quality?: number | undefined;
		  }
		| undefined;
}
export interface QRCodeToDataURLOptionsOther extends QRCodeRenderersOptions {
	/**
	 * Data URI format.
	 * @default 'image/png'
	 */
	type?: Exclude<QRCodeDataURLType, 'image/jpeg' | 'image/webp'> | undefined;
}

export interface QRCodeToStringOptionsTerminal extends QRCodeRenderersOptions {
	/**
	 * Output format.
	 * @default 'utf8'
	 */
	type: 'terminal';

	/**
	 * Inverse the color of the terminal.
	 */
	inverse?: boolean;

	/**
	 * Outputs smaller QR code.
	 * @default false
	 */
	small?: boolean | undefined;
}
export interface QRCodeToStringOptionsOther extends QRCodeRenderersOptions {
	/**
	 * Output format.
	 * @default 'utf8'
	 */
	type?: Exclude<QRCodeStringType, 'terminal'> | undefined;
}

export type QRCodeFileType = 'png' | 'svg' | 'utf8';
export type QRCodeToFileOptions = QRCodeToFileOptionsPng | QRCodeToFileOptionsOther;
export interface QRCodeToFileOptionsPng extends QRCodeRenderersOptions {
	/**
	 * Output format.
	 * @default 'png'
	 */
	type?: Exclude<QRCodeFileType, 'svg' | 'utf8'> | undefined;
	rendererOpts?:
		| {
				/**
				 * Compression level for deflate.
				 * @default 9
				 */
				deflateLevel?: number | undefined;
				/**
				 * Compression strategy for deflate.
				 * @default 3
				 */
				deflateStrategy?: number | undefined;
		  }
		| undefined;
}
export interface QRCodeToFileOptionsOther extends QRCodeRenderersOptions {
	/**
	 * Output format.
	 * @default 'png'
	 */
	type: Exclude<QRCodeFileType, 'png'> | undefined;
}

export interface QRCodeToFileStreamOptions extends QRCodeRenderersOptions {
	/**
	 * Output format. Only png supported for file stream.
	 */
	type?: Exclude<QRCodeFileType, 'svg' | 'utf8'> | undefined;
	rendererOpts?:
		| {
				/**
				 * Compression level for deflate.
				 * @default 9
				 */
				deflateLevel?: number | undefined;
				/**
				 * Compression strategy for deflate.
				 * @default 3
				 */
				deflateStrategy?: number | undefined;
		  }
		| undefined;
}

export interface QRCodeToBufferOptions extends QRCodeRenderersOptions {
	/**
	 * Output format. Only png supported for Buffer.
	 */
	type?: Exclude<QRCodeFileType, 'svg' | 'utf8'> | undefined;
	rendererOpts?:
		| {
				/**
				 * Compression level for deflate.
				 * @default 9
				 */
				deflateLevel?: number | undefined;
				/**
				 * Compression strategy for deflate.
				 * @default 3
				 */
				deflateStrategy?: number | undefined;
		  }
		| undefined;
}

export function hex2rgba(hex: string) {
	if (typeof hex !== 'string') {
		throw new Error('Color should be defined as hex string');
	}

	let hexCode = hex.slice().replace('#', '').split('');
	if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
		throw new Error('Invalid hex color: ' + hex);
	}

	// Convert from short to long form (fff -> ffffff)
	if (hexCode.length === 3 || hexCode.length === 4) {
		hexCode = Array.prototype.concat.apply(
			[],
			hexCode.map(function (c) {
				return [c, c];
			})
		);
	}

	// Add default alpha value
	if (hexCode.length === 6) hexCode.push('F', 'F');

	const hexValue = parseInt(hexCode.join(''), 16);

	return {
		r: (hexValue >> 24) & 255,
		g: (hexValue >> 16) & 255,
		b: (hexValue >> 8) & 255,
		a: hexValue & 255,
		hex: '#' + hexCode.slice(0, 6).join(''),
	};
}

export type QRCodeOptionsInput =
	| QRCodeToDataURLOptionsJpegWebp
	| QRCodeToDataURLOptionsOther
	| QRCodeToStringOptionsTerminal
	| QRCodeToStringOptionsOther
	| QRCodeToFileOptionsPng
	| QRCodeToFileOptionsOther
	| QRCodeToFileStreamOptions
	| QRCodeToBufferOptions;

export type QRCodeOptionsOutput = Omit<QRCodeOptionsInput, 'color'> & {
	scale: number;
	margin: number;
	color: {
		dark: ReturnType<typeof hex2rgba>;
		light: ReturnType<typeof hex2rgba>;
	};
	rendererOpts:
		| QRCodeToDataURLOptionsJpegWebp['rendererOpts']
		| QRCodeToFileOptionsPng['rendererOpts']
		| QRCodeToFileStreamOptions['rendererOpts']
		| QRCodeToBufferOptions['rendererOpts']
		| {};
};
export function getOptions(options: QRCodeOptionsInput): QRCodeOptionsOutput {
	if (!options) options = {};
	if (!options.color) options.color = {};

	const margin =
		typeof options.margin === 'undefined' || options.margin === null || options.margin < 0
			? 4
			: options.margin;

	const width = options.width && options.width >= 21 ? options.width : undefined;
	const scale = options.scale || 4;

	return {
		width: width,
		scale: width ? 4 : scale,
		margin: margin,
		color: {
			dark: hex2rgba(options.color.dark || '#000000ff'),
			light: hex2rgba(options.color.light || '#ffffffff'),
		},
		type: options.type,
		rendererOpts: 'rendererOpts' in options ? options.rendererOpts : {},
	};
}

type GetScaleInput = {
	/**
	 * Define how much wide the quiet zone should be.
	 * @default 4
	 */
	margin?: number | undefined;
	/**
	 * Scale factor. A value of `1` means 1px per modules (black dots).
	 * @default 4
	 */
	scale?: number | undefined;
	/**
	 * Forces a specific width for the output image.
	 * If width is too small to contain the qr symbol, this option will be ignored.
	 * Takes precedence over `scale`.
	 */
	width?: number | undefined;
};

export function getScale(qrSize: number, { width, scale = 4, margin = 4 }: GetScaleInput) {
	return width && width >= qrSize + margin * 2 ? width / (qrSize + margin * 2) : scale;
}

type GetImageWidthInput = GetScaleInput;

export function getImageWidth(
	qrSize: number,
	{ width, scale: _scale = 4, margin = 4 }: GetImageWidthInput
) {
	const scale = getScale(qrSize, { width, scale: _scale, margin });
	return Math.floor((qrSize + margin * 2) * scale);
}

export function qrToImageData(imgData: unknown[], qr: QRCode, opts: QRCodeOptionsOutput) {
	const size = qr.modules.size;
	const data = qr.modules.data;
	const scale = getScale(size, opts);
	const symbolSize = Math.floor((size + opts.margin * 2) * scale);
	const scaledMargin = opts.margin * scale;
	const palette = [opts.color.light, opts.color.dark];

	for (let i = 0; i < symbolSize; i++) {
		for (let j = 0; j < symbolSize; j++) {
			let posDst = (i * symbolSize + j) * 4;
			let pxColor = opts.color.light;

			if (
				i >= scaledMargin &&
				j >= scaledMargin &&
				i < symbolSize - scaledMargin &&
				j < symbolSize - scaledMargin
			) {
				const iSrc = Math.floor((i - scaledMargin) / scale);
				const jSrc = Math.floor((j - scaledMargin) / scale);
				pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
			}

			imgData[posDst++] = pxColor.r;
			imgData[posDst++] = pxColor.g;
			imgData[posDst++] = pxColor.b;
			imgData[posDst] = pxColor.a;
		}
	}
}
