export function createObject<T>(proto: object): T {
	return Object.create(proto);
}