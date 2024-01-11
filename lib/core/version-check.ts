/**
 * Check if QR Code version is valid
 *
 * @return {Boolean} true if valid version, false otherwise
 */
export function isValid(qrCodeVersion: number) {
	return !isNaN(qrCodeVersion) && qrCodeVersion >= 1 && qrCodeVersion <= 40;
}
