import { assert } from 'chai';
import 'jsdom-global/register';
import Vue from 'vue';
import VueLocalDataProp from '../src';

describe('VueLocalDataProp', () => {
	it('check plugin initialization', () => {
		Vue.use(VueLocalDataProp);

		const vm = new Vue({
			el: document.createElement('div'),
		});

		const component = Vue.component('simple-component', {
			props: {
				myProp: {
					type: String,
					default: 'hello!',
					localData: true
				}
			},
		});

		const sc = new component({});

		assert(sc.localMyProp === 'hello!', 'local prop data exist');
	})
})
