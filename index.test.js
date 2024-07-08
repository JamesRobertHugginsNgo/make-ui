import { setStyles } from 'https://cdn.jsdelivr.net/gh/JamesRobertHugginsNgo/make-html@2.0.0/index.js';

import { makeUi, mergeValues } from 'https://cdn.jsdelivr.net/gh/JamesRobertHugginsNgo/make-ui@1.0.1-alpha/index.js';
const uiMakers = {};

uiMakers['greeting'] = (definition, options = {}) => {
	const { greeting = 'Hello', message } = definition;
	return makeUi({
		name: 'p',
		children: [
			greeting,
			' ',
			{
				type: 'message',
				message
			}
		],
		callback(result) {
			const { element } = result;
			return {
				init() {
					console.log('GREETING', element);
				},
				metaData: { greeting: true }
			};
		}
	}, options);
};

uiMakers['message'] = (definition, options = {}) => {
	const { message = 'World' } = definition;
	return makeUi({
		name: 'strong',
		children: [message],
		callback(result) {
			const { element } = result;
			return {
				init() {
					console.log('MESSAGE', element);
					setStyles(element, { color: 'salmon ' });
				},
				metaData: { message: true }
			};
		}
	}, options);
};

const mergeValuesOption = (value1, value2, mergeFunctions = []) => {
	mergeFunctions.push((value1, value2, key) => {
		if (key !== 'init') {
			return;
		}
		return {
			merged: true,
			value(...args) {
				value1.call(this, ...args);
				value2.call(this, ...args);
			}
		};
	});
	return mergeValues(value1, value2, mergeFunctions);
};

const makeUiOptions = { mergeValues: mergeValuesOption, uiMakers };

const { init, element, metaData } = makeUi({
	type: 'greeting',
	greeting: 'Halo',
	message: 'Universe'
}, makeUiOptions);

document.body.append(element);

console.log('metaData', metaData);
init();
