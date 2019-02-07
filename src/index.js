import _ from 'lodash';

const VueLocalDataProp = {
  install: (Vue) => {
    Vue.mixin({
      beforeCreate() {
        const newData = {};

        _.each(this.$options.props, (val, key) => {
          const propValue = !_.isUndefined(this.$options.propsData)
            ? this.$options.propsData[key]
            : undefined;

          if (_.has(this.$options.props[key], 'localData')) {
            const newVarKey = `local${key.charAt(0).toUpperCase()}${key.slice(1)}`;

            if (_.isObject(propValue)) {
              newData[newVarKey] = _.cloneDeep(propValue);
            } else if (_.isUndefined(propValue)) {
              if (!_.has(this.$options.props[key], 'default')) {
                return;
              }
              newData[newVarKey] = _.isFunction(this.$options.props[key].default)
                ? this.$options.props[key].default()
                : this.$options.props[key].default;
            } else {
              newData[newVarKey] = propValue;
            }

            if (_.isUndefined(this.$options.watch)) {
              this.$options.watch = {};
            }

            this.$options.watch[key] = function watch(value) {
              if (_.isPlainObject(value)) {
                this[newVarKey] = _.merge(this[newVarKey], value);
              } else {
                this[newVarKey] = value;
              }
            };
          }

          if (_.has(this.$options.props[key], 'proxyData')) {
            let computedName;

            const computedObject = {
              set: (value) => {
                this.$emit('input', value);
              },

              get: () => this[key],
            };

            if (_.isBoolean(this.$options.props[key].proxyData)) {
              computedName = `local${key.charAt(0).toUpperCase()}${key.slice(1)}`;
            }

            if (_.isObject(this.$options.props[key].proxyData)) {
              computedName = this.$options.props[key].proxyData.name;

              if (_.has(this.$options.props[key].proxyData, 'setMethod')) {
                computedObject.set = this.$options.props[key].proxyData.setMethod;
              }

              if (_.has(this.$options.props[key].proxyData, 'getMethod')) {
                computedObject.get = this.$options.props[key].proxyData.getMethod;
              }
            }

            if (_.isUndefined(this.$options.computed)) {
              this.$options.computed = {};
            }

            this.$options.computed[computedName] = computedObject;
          }
        });

        if (!_.isEmpty(newData)) {
          const originalData = _.isFunction(this.$options.data)
            ? this.$options.data()
            : {};

          this.$options.data = () => Object.assign(originalData, newData);
        }
      },
    });
  }
};

// register plugin if it is used via cdn or directly as a script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.VueLocalDataProp = VueLocalDataProp;
}

export default VueLocalDataProp;
