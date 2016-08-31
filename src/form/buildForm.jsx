
import * as _ from 'lodash';
import moment from 'moment';


import React from 'react';
import {
  Table, Button, Modal, Row, Col,
  /* 表单 */
  Form,        // 表单
  Input,       // 普通输入框: <input type="{T}" />
  InputNumber, // 数字输入框
  Checkbox,    // 多选框
  Radio,       // 单选框
  Cascader,    // 级联选择
  Transfer,    // 穿梭框
  Select,      // 选择器
  TreeSelect,  // 树选择
  Slider,      // 滑动输入条
  Switch,      // 开关
  DatePicker,  // 日期选择
  TimePicker,  // 时间选择
  Upload,      // 上传
} from 'antd';

import {
  BaseForm, FormModal, SearchForm,
  FormItem, formRules, formHelpers
} from './Form';


const Config = {
  type: "create" || "update",
  formProps: Object,
  title: String, // FormModal:: title
  modalProps: Object, // FormModal:: modalProps
  onSubmit: Function,
  init: Function, // FormModal:: componentDidMount(), for init select options
  fields: [
    {
      name: String,
      type: String,
      attrs: Object, // For <Input>
      options: Array, // For <Select>
      label: String,
      placeholder: String,
      required: Boolean,
    }
  ]
};

const SearchConfig = {
  filters: Array, // SearchForm:: query filters
  layout: Array,  // SearchForm:: fields layout
  formProps: Object,
  onSubmit: Function,
  init: Function, // SearchForm:: componentDidMount(), for init select options
  fields: [
    {
      name: String,
      type: String,
      attrs: Object, // For <Input>
      options: Array, // For <Select>
      operation: String, // SearchForm:: operation
      label: String,
      placeholder: String,
    }
  ]
};



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const RangePicker = DatePicker.RangePicker;

export class FormField {
  constructor({name, type, operation, render}) {
    this.name = name;
    this.type = type;
    this.operation = operation;
    this.render = render;
  }
}

export function renderTextField(config) {
  const rules = config.rules !== undefined ? config.rules :
                config.required ? [{required: true, message: config.placeholder}] : [];
  return {
    type: "text",
    operation: config.operation,
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return (
        <FormItem label={config.label} {...itemProps}>
          <Input type="text" placeholder={config.placeholder}
            style={{width: '100%'}}
            {...config.attrs}
            {...inputProps}/>
        </FormItem>
      );
    }
  };
}

export function renderPasswordField(config) {
  const rules = config.rules !== undefined ? config.rules :
                config.required ? [{required: true, message: config.placeholder}] : [];
  return {
    type: "password",
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return (
        <FormItem label={config.label} {...itemProps}>
          <Input type="password" placeholder={config.placeholder}
            style={{width: '100%'}}
            {...config.attrs}
            {...inputProps}/>
        </FormItem>
      );
    }
  };
}

export function renderBooleanField(config) {
  const rules = config.rules !== undefined ? config.rules : [];
  return {
    type: "boolean",
    operation: config.operation,
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return (
        <FormItem label={config.label} {...itemProps}>
          <Switch checkedChildren="是" unCheckedChildren="否"
                  checked={form.getFieldValue(field)}
                  {...config.attrs} {...inputProps}/>
        </FormItem>
      );
    }
  };
}

export function renderNumberField(config) {
  const rules = config.rules !== undefined ? config.rules :
               config.required ? [{
                 required: true, message: config.placeholder, type: 'number'
               }] : [];
  return {
    type: 'number',
    operation: config.operation,
    render({ field, form, itemProps }) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      const attrs = config.attrs;
      let step = attrs.step ? attrs.step : 1;
      let min = attrs.min ? attrs.min : 0;
      return (
        <FormItem label={config.label} {...itemProps}>
        <InputNumber placeholder={config.placeholder} style={{ width: '100%' }}
          {...attrs} min={min} step={step}
          {...inputProps}  />
        </FormItem>
      );
    },
  };
}

export function renderTextareaField(config) {
  const rules = config.rules !== undefined ? config.rules :
                config.required ? [{required: true, message: config.placeholder}] : [];
  return {
    type: "textarea",
    operation: config.operation,
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return (
        <FormItem label={config.label} {...itemProps}>
          <Input type="textarea" placeholder={config.placeholder}
            {...config.attrs} {...inputProps}/>
        </FormItem>
      );
    }
  };
}

export function renderFileField(config) {
  const rules = config.rules !== undefined ? config.rules :
                config.required ? [formRules.fileRequired(config.placeholder)] : [];
  return {
    type: "file",
    render({ field, form, itemProps }) {
      const inputProps = form.getFieldProps(field, {
        getValueProps: formHelpers.getFileValueProps,
        getValueFromEvent: formHelpers.getValueFromFileEvent,
        rules: rules,
      });

      return <FormItem label={config.label} {...itemProps}>
        <Input type="file" {...config.attrs} {...inputProps}/>
      </FormItem>;
    },
  }
}

export function renderDateField(config) {
  const rules = config.rules !== undefined ? config.rules :
                config.required ? [{required: true, message: config.placeholder, type: 'date'}] : [];
  return {
    type: "date",
    operation: config.operation,
    render({ field, form, itemProps }) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return <FormItem label={config.label} {...itemProps}>
        <DatePicker {...config.attrs} {...inputProps} />
      </FormItem>;
    }
  };
}

export function renderSelectField(config) {
  const rules = config.rules !== undefined ? config.rules :
                config.required ? [{required: true, message: config.placeholder}] : [];
  return {
    type: "select",
    operation: config.operation,
    render({form ,field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      const options = config.options || _.get(_.get(this.state, "options", {}), field, []);
      return <FormItem label={config.label} {...itemProps}>
        <Select {...config.attrs} placeholder={config.placeholder} {...inputProps}>
          {formHelpers.makeOptionElements(options)}
        </Select>
      </FormItem>;
    }
  };
}

export function renderMultipleSelectField(config) {
  const rules = config.rules !== undefined ? config.rules :
                config.required ? [
                  {required: true, message: config.placeholder, type: 'array'}
                ] : [];
  return {
    type: "multiple_select",
    operation: _.get(config, "operation", "in"), // ["in", "~in"]
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      const options = _.get(config, 'options', _.get(_.get(this.state, "options", {}), "field", []));
      return <FormItem label={config.label} {...itemProps}>
        <Select multiple style={{width: "100%"}}
                {...config.attrs} placeholder={config.placeholder} {...inputProps}>
          {formHelpers.makeOptionElements(options)}
        </Select>
      </FormItem>;
    }
  }
}

export function renderTimeField(config) {
  const rules = config.rules !== undefined ? config.rules :
                config.required ? [{required: true, message: config.placeholder}] : [];
  const format = _.get(config, "format", "HH:mm:ss");
  return {
    type: "time",
    format: config.format,
    render({form, field, itemProps}) {
      const inputProps = form.getFieldProps(field, {rules: rules});
      return <FormItem label={config.label} {...itemProps}>
        <TimePicker format={format}
                    {...config.attrs}
                    placeholder={config.placeholder}
                    {...inputProps} />
      </FormItem>;
    }
  };
}

export function renderRangeDateField(config) {
  return {
    type: "range_date",
    render({form, field, itemProps}) {
      return <FormItem label={config.label} {...itemProps}>
        <RangePicker {...config.attrs} {...form.getFieldProps(field)}/>
      </FormItem>
    }
  };
}

export function buildItems(config) {
  let fieldItems = {};
  config.fields.forEach(function(field) {
    if (field.render !== undefined) {
      fieldItems[field.name] = field;
    } else {
      if (field.type === undefined) {
        field.type = "text";
      }
      if (field.attrs === undefined) {
        field.attrs = {};
      }
      fieldItems[field.name] = {
        "text": renderTextField,
        "password": renderPasswordField,
        "number": renderNumberField,
        "boolean": renderBooleanField,
        "textarea": renderTextareaField,
        "file": renderFileField,
        "date": renderDateField,
        "select": renderSelectField,
        "multiple_select": renderMultipleSelectField,
        "time": renderTimeField,
        "range_date": renderRangeDateField,
      }[field.type](field);
    }
  });
  return fieldItems;
}

export function buildForm(config) {
  let fieldNames = config.fields.map((field) => field.name);
  const fieldItems = buildItems(config);

  class _Form extends BaseForm {
    static defaultProps = {
      ...BaseForm.defaultProps,
      type: config.type,
      formProps: {...BaseForm.formProps, ...config.formProps},
      fields: fieldNames,
      items: fieldItems
    }

    onSubmit(values, callback) {
      config.onSubmit.bind(this)(values, callback);
    }
  }

  return Form.create()(_Form);
}

export function buildFormModal(config) {
  let fieldNames = config.fields.map((field) => field.name);
  const fieldItems = buildItems(config);
  const title = _.get(
    config, "title",
    _.get({create: "添加记录", update: "更新记录"}, config.type, "[未知]"));

  class _FormModal extends FormModal {
    static defaultProps = {
      ...FormModal.defaultProps,
      type: config.type,
      formProps: {...FormModal.formProps, ...config.formProps},
      modalProps: {...FormModal.modalProps, ...config.modalProps},
      title: title,
      fields: fieldNames,
      items: fieldItems
    }

    componentDidMount() {
      this.resetForm();
      if (config.init !== undefined) {
        config.init.bind(this)();
      }
    }

    onSubmit(values, callback) {
      const theOnSubmit = _.get(config, "onSubmit", this.props.onSubmit);
      theOnSubmit.bind(this)(values, callback);
    }
  }

  return Form.create()(_FormModal);
}


export function buildSearchForm(config) {
  let fieldNames = config.fields.map((field) => field.name);
  const fieldItems = buildItems(config);

  class _SearchForm extends SearchForm{
    static defaultProps = {
      ...SearchForm.defaultProps,
      type: "update",
      formProps: {
        ...SearchForm.formProps,
        style: {marginTop: '8px', width: '640px'},
        ...config.formProps},
      layout: _.get(config, "layout", [fieldNames]),
      defaultFilters: config.defaultFilters,
      fields: fieldNames,
      items: fieldItems
    }

    componentDidMount() {
      if (config.init !== undefined) {
        config.init.bind(this)();
      }
    }

    onSubmit(values, callback) {
      const { fields, items, defaultFilters } = this.props;
      const { table } = this.props;
      let query = table.state.query;
      query.page = 1;
      // FIXME: defaultFilters 并没有生效
      query.filters = defaultFilters === undefined ? [] : defaultFilters;
      fields.forEach(function(name) {
        const value = values[name];
        if (!(value === undefined)) {
          const item = items[name];
          if (item.type === "range_date") {
            query.updateFilter(name, '>=', moment(value[0]).format('YYYY-MM-DD'));
            query.updateFilter(name, '<', moment(value[1]).add('days', 1).format('YYYY-MM-DD'));
          } else {
            const operation = _.get(item, 'operation', '==');
            query.updateFilter(name, operation, value);
          }
        }
      });

      table.setState({
        query: query,
      }, () => {
        table.loadPage();
        callback(values);
      });
    }
  }

  return Form.create()(_SearchForm);
}
