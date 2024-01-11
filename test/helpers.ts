const nativePromise = global.Promise;

export function removeNativePromise() {
	if (global.Promise) {
		// @ts-ignore Promise is technically required but we're removing it for testing purposes
		delete global.Promise;
	}
}

export function restoreNativePromise() {
	if (!global.Promise) {
		global.Promise = nativePromise;
	}
}
