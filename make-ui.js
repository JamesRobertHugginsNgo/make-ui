import { makeHtml } from 'https://cdn.jsdelivr.net/gh/JamesRobertHugginsNgo/make-html@2.1.0/index.js';

import mergeValues from './merge-values.js';

export const uiMakers = {};

export default function makeUi(definition, options = {}) {
	const { mergeValues: mergeValuesOptions = mergeValues, uiMakers: uiMakersOption = uiMakers } = options;
	const objectConstructor = ({}).constructor;

	const make = (definition) => {
		const { type } = definition;
		if (type) {
			return uiMakersOption[type](definition, options);
		}

		const { children, callback, ...htmlDefinition } = definition;

		let result = {};

		const element = makeHtml({
			...htmlDefinition,
			children: !children ? null : children.map((child) => {
				if (child == null) {
					return;
				}

				if (Array.isArray(child)) {
					const { element: childElement, ...childResult } = make({ children: child });
					result = mergeValuesOptions(result, childResult);
					return childElement;
				}

				if (child.constructor && child.constructor === objectConstructor) {
					const { element: childElement, ...childResult } = make(child);
					result = mergeValuesOptions(result, childResult);
					return childElement;
				}

				return child;
			})
		});

		result.element = element;

		if (callback) {
			const callbackResult = callback(result, definition);
			result = mergeValuesOptions(result, callbackResult);
		}

		return result;
	};

	return make(definition);
}
