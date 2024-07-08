/**
 * Merges 2 values, including nested objects and custom merging.
 * @param {any} value1 First value.
 * @param {any} value2 Second value.
 * @param {[function]} mergeFunctions A list of merge functions.
 * @returns {any}
 */
export default function mergeValues(value1, value2, mergeFunctions) {
	const objectConstructor = ({}).constructor;

	const merge = (value1, value2, key) => {
		if (value2 === undefined) {
			return value1;
		}

		if (value1 === undefined) {
			return value2;
		}

		if (
			value1 && value1.constructor && value1.constructor === objectConstructor
			&& value2 && value2.constructor && value2.constructor === objectConstructor
		) {
			const value = {};
			const keys = [...Object.keys(value1), ...Object.keys(value2)];
			for (let index = 0; index < keys.length; index++) {
				const key = keys[index];
				if (keys.indexOf(key) !== index) {
					continue;
				}
				value[key] = merge(value1[key], value2[key], key);
			}
			return value;
		}

		if (mergeFunctions) {
			for (const mergeFunction of mergeFunctions) {
				const result = mergeFunction(value1, value2, key);
				if (result) {
					const { merged = false, value } = result;
					if (merged) {
						return value;
					}
				}
			}
		}

		return value2;
	};

	return merge(value1, value2);
}
