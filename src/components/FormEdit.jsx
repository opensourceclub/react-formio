import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import _camelCase from 'lodash/camelCase';

export default class FormEdit extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    options: PropTypes.object,
    builder: PropTypes.any,
    onSave: PropTypes.func
  }

  constructor(props) {
    super(props);

    const {form} = props;

    this.state = {
      form: form
        ? _cloneDeep(form)
        : {
          title: '',
          name: '',
          path: '',
          display: 'form',
          type: 'form',
          components: [],
        },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.form && (prevState.form._id !== nextProps.form._id || prevState.form.modified !== nextProps.form.modified)) {
      return {
        form: _cloneDeep(nextProps.form),
      };
    }

    return null;
  }

  saveForm() {
    if (this.props.saveForm && typeof this.props.saveForm === 'function') {
      this.props.saveForm(this.state.form);
    }
  }

  handleChange(path, event) {
    const {target} = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState((prev) => {
      const form = _cloneDeep(prev.form);
      _set(form, path, value);

      // If setting title, autogenerate name and path as well.
      if (path === 'title' && !form._id) {
        form.name = _camelCase(value);
        form.path = _camelCase(value).toLowerCase();
      }

      return {
        ...prev,
        form,
      };
    });
  }

  render() {
    const {form} = this.state;
    const {saveText} = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-lg-2 col-md-4 col-sm-4">
            <div id="form-group-title" className="form-group">
              <label htmlFor="title" className="control-label field-required">标题</label>
              <input
                type="text"
                className="form-control" id="title"
                placeholder="表单标题"
                value={this.state.form.title || ''}
                onChange={event => this.handleChange('title', event)}
              />
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-4">
            <div id="form-group-name" className="form-group">
              <label htmlFor="name" className="control-label field-required">名字</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="表单API Key"
                value={this.state.form.name || ''}
                onChange={event => this.handleChange('name', event)}
              />
            </div>
          </div>
          <div className="col-lg-2 col-md-3 col-sm-3">
            <div id="form-group-display" className="form-group">
              <label htmlFor="name" className="control-label">显示类型</label>
              <div className="input-group">
                <select
                  className="form-control"
                  name="form-display"
                  id="form-display"
                  value={this.state.form.display}
                  onChange={event => this.handleChange('display', event)}
                >
                  <option label="表单" value="form">Form</option>
                  <option label="PDF" value="pdf">PDF</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-3 col-sm-3">
            <div id="form-group-type" className="form-group">
              <label htmlFor="form-type" className="control-label">存储类型</label>
              <div className="input-group">
                <select
                  className="form-control"
                  name="form-type"
                  id="form-type"
                  value={this.state.form.type}
                  onChange={event => this.handleChange('type', event)}
                >
                  <option label="数据库" value="form">数据库</option>
                  <option label="文件" value="resource">文件</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-4">
            <div id="form-group-path" className="form-group">
              <label htmlFor="path" className="control-label field-required">路径</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="path"
                  style={{'textTransform': 'lowercase', width:'120px'}}
                  value={this.state.form.path || ''}
                  onChange={event => this.handleChange('path', event)}
                />
              </div>
            </div>
          </div>
          <div id="save-buttons" className="col-lg-2 col-md-5 col-sm-5 save-buttons pull-right">
            <div className="form-group pull-right">
              <span className="btn btn-primary" onClick={() => this.saveForm()}>
                {saveText}
              </span>
            </div>
          </div>
        </div>
        <FormBuilder
          key={form._id}
          form={form}
          options={this.props.options}
          builder={this.props.builder}
        />
      </div>
    );
  }
}
