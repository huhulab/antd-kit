'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchForm = exports.FormModal = exports.BaseForm = exports.formRules = exports.formHelpers = exports.FormItem = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormItem = exports.FormItem = _antd.Form.Item;

var MAX_SPAN = 24;

//// Form Helpers
var formHelpers = exports.formHelpers = {
  // See: http://react-component.github.io/form/examples/file-input.html
  getFileValueProps: function getFileValueProps(value) {
    console.log('getFileValueProps:', value);
    if (value && value.target) {
      return { value: value.target.value };
    }
    return { value: value };
  },
  getValueFromFileEvent: function getValueFromFileEvent(_ref) {
    var target = _ref.target;

    return { target: target };
  },
  makeOptionElements: function makeOptionElements(options) {
    return options.map(function (item) {
      return _react2.default.createElement(
        Option,
        { key: item[0], value: String(item[0]) },
        item[1]
      );
    });
  }
};

//// Form Rules
var formRules = exports.formRules = {
  fileRequired: function fileRequired(message) {
    return function (rule, value, callback) {
      console.log('checkFile:', value);
      if (!value || !value.target || !value.target.files || value.target.files.length == 0) {
        return callback(message);
      }
      callback();
    };
  },
  imageDimensions: function imageDimensions(dimensions) {
    if (!dimensions) return undefined;
    if (_.isObject(dimensions)) {
      dimensions = [dimensions];
    }

    return function (rule, value, callback) {
      if (!!value && !!value.target && !!value.target.files && value.target.files.length > 0) {
        var promises = [];
        for (var i = 0; i < value.target.files.length; i++) {
          promises.push(new Promise(function (resolve, reject) {
            var file = value.target.files[i];
            var fr = new FileReader();
            fr.onload = function () {
              // file is loaded
              var img = new Image();
              img.onload = function () {
                var matched = false;
                dimensions.forEach(function (dimension) {
                  if (dimension.width == img.width && dimension.height == img.height) {
                    matched = true;
                  }
                });
                if (!matched) {
                  reject('尺寸不合法: 名字=' + file.name + ', 宽=' + img.width + ', 高=' + img.height);
                } else {
                  resolve();
                }
              };
              img.src = fr.result; // is the data URL because called with readAsDataURL
            };
            fr.readAsDataURL(file);
          }));
        }
        Promise.all(promises).then(function () {
          callback();
        }).catch(function (error) {
          callback(error);
        });
      } else {
        callback();
      }
    };
  }
};

////////////////////////////////////////////////////////////////////////////////
//// Classes
////////////////////////////////////////////////////////////////////////////////

var FormRow = function () {
  function FormRow(content) {
    var _this = this;

    _classCallCheck(this, FormRow);

    if (!_.isArray(content)) {
      content = [content];
    }

    if (content.length == 0) {
      console.error('Got empty <FormRow>.');
    }

    if (_.isString(content[0])) {
      (function () {
        var span = Math.floor(MAX_SPAN / content.length);
        _this.cols = content.map(function (name) {
          return { name: name, span: span };
        });
      })();
    } else {
      this.cols = content;
    }

    /* console.log('columns:', this.cols); */
    /* Check column */
    this.cols.forEach(function (col) {
      if (!_.isString(col.name) || !_.isNumber(col.span)) {
        console.error('Invalid column:', col);
      }
    });
  }

  _createClass(FormRow, [{
    key: 'renderFormItem',
    value: function renderFormItem(context, name) {
      var _context$props = context.props;
      var form = _context$props.form;
      var items = _context$props.items;
      var labelCol = _context$props.labelCol;
      var wrapperCol = _context$props.wrapperCol;

      var util = {
        form: form,
        field: name,
        itemProps: {
          key: 'field-' + name,
          labelCol: { span: labelCol },
          wrapperCol: { span: wrapperCol }
        }
      };
      // console.log('>>> util', util, '>>> context:', context);
      var item = items[name];
      var render = _.isFunction(item) ? item : item.render;
      return render.bind(context)(util);
    }
  }, {
    key: 'render',
    value: function render(context, key) {
      var _this2 = this;

      if (this.cols.length == 1 && this.cols[0].span == MAX_SPAN) {
        return this.renderFormItem(context, this.cols[0].name);
      } else {
        var columns = this.cols.map(function (col) {
          var formItem = _this2.renderFormItem(context, col.name);
          var colProps = { key: col.name, span: col.span };
          if (_.isNumber(col.offset)) {
            colProps.offset = col.offset;
          }
          return _react2.default.createElement(
            _antd.Col,
            colProps,
            formItem
          );
        });
        return _react2.default.createElement(
          _antd.Row,
          { key: key },
          columns
        );
      }
    }
  }]);

  return FormRow;
}();

var BaseForm = exports.BaseForm = function (_Component) {
  _inherits(BaseForm, _Component);

  function BaseForm(props) {
    _classCallCheck(this, BaseForm);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseForm).call(this, props));

    console.log('BaseForm.constructor, props.object=', JSON.stringify(_this3.props.object));
    _this3.state = { object: _this3.props.object };
    return _this3;
  }

  _createClass(BaseForm, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.resetForm();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var _this4 = this;

      console.log('componentWillReceiveProps', this.props.type, newProps);
      if (!_.isEqual(newProps.object, this.props.object)) {
        this.setState({ object: newProps.object }, function () {
          _this4.resetForm();
        });
      }
    }
  }, {
    key: 'getFields',
    value: function getFields() {
      var fields = this.props.fields;

      return _.isFunction(fields) ? fields.call(this) : fields;
    }
  }, {
    key: 'getLayout',
    value: function getLayout() {
      var layout = this.props.layout;

      return _.isFunction(layout) ? layout.call(this) : !!layout ? layout : this.getFields();
    }
  }, {
    key: 'formatObject',
    value: function formatObject(object) {
      console.log('formatObject:', object);
      var result = {};
      var items = this.props.items;

      var fields = this.getFields();
      fields.map(function (field) {
        var item = items[field];
        var value = object[field];
        if (value !== undefined && value !== null) {
          if (_.isBoolean(value)) {
            // pass
          } else if (item.type === "number") {
            value = parseFloat(value);
          } else if (item.type === "date") {
            value = new Date(value);
          } else if (item.type === "datetime") {
            value = new Date(value);
          } else if (item.type === "range_date") {
            value = [new Date(value[0]), new Date(value[1])];
          } else if (item.type === "file") {
            value = undefined;
          } else if (item.type === "multiple_select") {
            value = value.map(function (x) {
              return String(x);
            });
          } else {
            value = String(value);
          }

          result[field] = value;
        }
      });
      console.log('>>> fields:', fields, 'result', result);
      return result;
    }
  }, {
    key: 'handleReset',
    value: function handleReset() {
      var _props = this.props;
      var type = _props.type;
      var object = _props.object;
      var form = _props.form;

      form.resetFields();
      console.log('setFieldDefaults', type, object, this.state.object);
      var targetObject = type === "create" ? object : this.state.object;
      form.setFieldsValue(this.formatObject(targetObject));
    }
  }, {
    key: 'resetForm',
    value: function resetForm() {
      this.handleReset();
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this5 = this;

      console.log('BaseForm.handleSubmit', e);
      e.preventDefault();
      var _props2 = this.props;
      var type = _props2.type;
      var items = _props2.items;
      var form = _props2.form;
      var onSuccess = _props2.onSuccess;
      var object = this.state.object;

      var fields = this.getFields();
      form.validateFieldsAndScroll(function (errors, values) {
        if (!!errors) {
          console.log('Errors in form!!!', errors);
          return;
        }

        // preprocess values
        if (object.id !== undefined) {
          values.id = object.id;
        }
        fields.forEach(function (field) {
          var item = items[field];
          var value = values[field];
          switch (item.type) {
            case "date":
              if (!!value) {
                values[field] = (0, _moment2.default)(value).format('YYYY-MM-DD');
              }
              break;
            case "datetime":
              if (!!value) {
                values[field] = (0, _moment2.default)(value).format('YYYY-MM-DD HH:mm:ss');
              }
              break;
            case "file":
              if (_.isObject(item) && value) {
                values[field] = value.target.files;
              }
              break;
            case "multiple_select":
              if (values[field] == undefined) {
                values[field] = [];
              }
              break;
            default:
              break;
          }
        });

        var callback = function callback(newObject) {
          if (type === "create") {
            _this5.handleReset();
            onSuccess();
          } else {
            _this5.setState({ object: newObject }, function () {
              _this5.handleReset();
              onSuccess(newObject);
            });
          }
        };

        if (!!_this5.onSubmit) {
          _this5.onSubmit(values, callback);
        } else {
          _this5.props.onSubmit(_this5, values, callback);
        }
        console.log('Submit!!!', values);
      });
    }
  }, {
    key: 'renderFormBody',
    value: function renderFormBody() {
      var _this6 = this;

      var _props3 = this.props;
      var form = _props3.form;
      var items = _props3.items;
      var labelCol = _props3.labelCol;
      var wrapperCol = _props3.wrapperCol;
      /* console.log('renderFormBody:', JSON.stringify([
         this.props.type, this.state.object, this.props.object])); */

      var rows = this.getLayout(); // rows == layout
      /* console.log('renderFormBody.fields:', this.props.type, fields); */
      return rows.map(function (row, index) {
        if (!(row instanceof FormRow)) {
          row = new FormRow(row);
        }
        return row.render(_this6, 'row-' + index);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var _props4 = this.props;
      var form = _props4.form;
      var formProps = _props4.formProps;
      var labelCol = _props4.labelCol;
      var wrapperCol = _props4.wrapperCol;
      var footer = _props4.footer;

      var footerItem = !!footer ? footer.call(this) : _react2.default.createElement(
        FormItem,
        { key: '_footer', wrapperCol: { span: wrapperCol, offset: labelCol } },
        _react2.default.createElement(
          _antd.Button,
          { className: 'list-btn', type: 'primary', onClick: function onClick(e) {
              return _this7.handleSubmit(e);
            } },
          '提交'
        ),
        _react2.default.createElement(
          _antd.Button,
          { className: 'list-btn', type: 'ghost', onClick: function onClick(e) {
              return _this7.handleReset(e);
            } },
          '重置'
        )
      );
      var formBody = this.renderFormBody();
      formBody.push(footerItem);

      return _react2.default.createElement(
        _antd.Form,
        _extends({ onSubmit: function onSubmit(e) {
            return _this7.handleSubmit(e);
          }
        }, formProps),
        formBody
      );
    }
  }]);

  return BaseForm;
}(_react.Component);

BaseForm.propTypes = {
  type: _react.PropTypes.oneOf(["create", "update"]).isRequired,
  labelCol: _react.PropTypes.number,
  wrapperCol: _react.PropTypes.number,
  formProps: _react.PropTypes.object,
  fields: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.func]).isRequired,
  layout: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.func]),
  items: _react.PropTypes.object.isRequired,
  object: _react.PropTypes.object,
  onSubmit: _react.PropTypes.func, /* function(values, callback) or function(context, values, callback) */
  onSuccess: _react.PropTypes.func, /* function(object) */
  footer: _react.PropTypes.func
};
BaseForm.defaultProps = {
  labelCol: 6,
  wrapperCol: 14,
  formProps: { horizontal: true },
  layout: null,
  object: {},
  onSuccess: function onSuccess(object) {}
};

var FormModal = exports.FormModal = function (_BaseForm) {
  _inherits(FormModal, _BaseForm);

  function FormModal() {
    _classCallCheck(this, FormModal);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FormModal).apply(this, arguments));
  }

  _createClass(FormModal, [{
    key: 'render',
    value: function render() {
      var _this9 = this;

      var _props5 = this.props;
      var form = _props5.form;
      var formProps = _props5.formProps;
      var modalProps = _props5.modalProps;
      var footer = _props5.footer;

      var formBody = this.renderFormBody();
      var footerItem = !!footer ? footer.call(this) : _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _antd.Button,
          { type: 'ghost', onClick: function onClick(e) {
              return _this9.handleReset();
            } },
          '重置'
        ),
        _react2.default.createElement(
          _antd.Button,
          { type: 'primary', onClick: function onClick(e) {
              return _this9.handleSubmit(e);
            } },
          '提交'
        )
      );

      return _react2.default.createElement(
        _antd.Modal,
        _extends({ title: this.props.title,
          visible: this.props.visible,
          footer: footerItem,
          onCancel: function onCancel(e) {
            return _this9.props.onCancel();
          }
        }, modalProps),
        _react2.default.createElement(
          _antd.Form,
          _extends({ onSubmit: function onSubmit(e) {
              return _this9.handleSubmit(e);
            }
          }, formProps),
          formBody
        )
      );
    }
  }]);

  return FormModal;
}(BaseForm);

FormModal.propTypes = _extends({}, BaseForm.propTypes, {
  visible: _react.PropTypes.bool.isRequired,
  title: _react.PropTypes.string,
  modalProps: _react.PropTypes.object,
  onCancel: _react.PropTypes.func });
FormModal.defaultProps = _extends({}, BaseForm.defaultProps, {
  title: "表单",
  modalProps: {}
});

var SearchForm = exports.SearchForm = function (_BaseForm2) {
  _inherits(SearchForm, _BaseForm2);

  function SearchForm() {
    _classCallCheck(this, SearchForm);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SearchForm).apply(this, arguments));
  }

  _createClass(SearchForm, [{
    key: 'handleReset',
    value: function handleReset(e) {
      var _props6 = this.props;
      var type = _props6.type;
      var object = _props6.object;
      var form = _props6.form;

      form.resetFields();
      var targetObject = object;
      if (!e) {
        targetObject = this.state.object;
      }
      form.setFieldsValue(this.formatObject(targetObject));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this11 = this;

      if (!this.props.visible) {
        return null;
      }

      var _props7 = this.props;
      var form = _props7.form;
      var formProps = _props7.formProps;
      var footer = _props7.footer;

      var footerItem = !!footer ? footer.call(this) : _react2.default.createElement(
        _antd.Row,
        { key: '_footer' },
        _react2.default.createElement(
          _antd.Col,
          { style: { textAlign: 'right' } },
          _react2.default.createElement(
            _antd.Button,
            { className: 'list-btn', type: 'primary', htmlType: 'submit',
              onClick: function onClick(e) {
                return _this11.handleSubmit(e);
              } },
            '搜索'
          ),
          _react2.default.createElement(
            _antd.Button,
            { className: 'list-btn', type: 'ghost', onClick: function onClick(e) {
                return _this11.handleReset(e);
              } },
            '清除条件'
          )
        )
      );
      var formBody = this.renderFormBody();
      formBody.push(footerItem);

      return _react2.default.createElement(
        _antd.Form,
        _extends({ onSubmit: function onSubmit(e) {
            return _this11.handleSubmit(e);
          },
          className: 'advanced-search-form'
        }, formProps),
        formBody
      );
    }
  }]);

  return SearchForm;
}(BaseForm);

SearchForm.propTypes = _extends({}, BaseForm.propTypes, {
  visible: _react.PropTypes.bool.isRequired
});
SearchForm.defaultProps = _extends({}, BaseForm.defaultProps, {
  type: "update",
  labelCol: 10,
  wrapperCol: 14
});