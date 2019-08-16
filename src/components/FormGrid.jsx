import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _isString from 'lodash/isString';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import React from 'react';

import {Button} from '@material-ui/core';
import {Icon} from '@material-ui/core';
import {withStyles} from '@material-ui/styles';

import {defaultPageSizes} from '../constants';
import {
  Columns,
  Operations,
  PageSizes,
} from '../types';
import {stopPropagationWrapper} from '../utils';

import Grid from './Grid';

const styles = {
  grid: {
    marginBottom: '1rem'
  },
  button: {
    marginRight: 10
  }
};
export default withStyles(styles)(class FormGrid extends React.Component {
  static propTypes = {
    columns: Columns,
    formAccess: PropTypes.func,
    forms: PropTypes.object.isRequired,
    getForms: PropTypes.func,
    onAction: PropTypes.func,
    onPageSizeChanged: PropTypes.func,
    operations: Operations,
    pageSizes: PageSizes,
    classes: PropTypes.object,
  }

  static defaultProps = {
    columns: [
      {
        key: 'title',
        sort: true,
        title: '名字',
        width: 8,
      },
      {
        key: 'operations',
        title: '操作',
        width: 4,
      },
    ],
    formAccess: () => ({
      form: {
        create: true,
        view: true,
        edit: true,
        delete: true,
      },
      submission: {
        create: true,
        view: true,
        edit: true,
        delete: true,
      },
    }),
    getForms: () => {},
    onPageSizeChanged: () => {},
    operations: [
      {
        action: 'view',
        buttonType: 'default',
        icon: <Icon className={'fa fa-plus-square'}/>,
        permissionsResolver() {
          return true;
        },
        title: '提交',
      },
      {
        action: 'submission',
        buttonType: 'default',
        icon: <Icon className={'fa fa-eye'}/>,
        permissionsResolver() {
          return true;
        },
        title: '查看',
      },
      {
        action: 'edit',
        buttonType: 'default',
        icon: <Icon className={'fa fa-edit'}/>,
        permissionsResolver() {
          return true;
        },
        title: '编辑',
      },
      {
        action: 'delete',
        buttonType: 'secondary',
        icon: <Icon className={'fa fa-trash-o'}/>,
        permissionsResolver() {
          return true;
        },
        title: '删除',
      },
    ],
    pageSizes: defaultPageSizes,
  };

  onSort = ({
    key,
    sort,
  }) => {
    if (_isFunction(sort)) {
      return sort();
    }

    const {
      forms: {
        sort: currentSort,
      },
      getForms,
    } = this.props;

    const sortKey = _isString(sort) ? sort : key;
    const ascSort = sortKey;
    const descSort = `-${sortKey}`;
    const noSort = '';

    let nextSort = noSort;
    if (currentSort === ascSort) {
      nextSort = descSort;
    }
    else if (currentSort === descSort) {
      nextSort = noSort;
    }
    else {
      nextSort = ascSort;
    }

    getForms(1, {
      sort: nextSort,
    });
  };

  Cell = ({
    row: form,
    column,
  }) => {
    const {
      formAccess,
      onAction,
      operations = [],
    } = this.props;

    const access = formAccess(form);

    if (column.key === 'title') {
      return (
        <span
          style={{cursor: 'pointer'}}
          onClick={stopPropagationWrapper(() => {
            if (access.submission.create) {
              onAction(form, 'view');
            }
          })}
        >
          <span>{form.title}</span>
        </span>
      );
    }
    else if (column.key === 'operations') {
      return (
        <div>
          {
            operations.map(({
              action,
              buttonType = 'default',
              icon = <Icon/>,
              permissionsResolver = () => true,
              title = '',
            }) =>
              permissionsResolver(form)
                ? (
                  <Button
                    variant="contained"
                    color={buttonType}
                    className={this.props.classes.button}
                    onClick={stopPropagationWrapper(() => onAction(form, action))}
                    key={action}
                  >
                    {icon}
                    &nbsp;&nbsp;
                    {title}
                  </Button>
                )
                : null
            )
          }
        </div>
      );
    }

    return (
      <span>
        {
          _isFunction(column.value)
            ? column.value(form)
            : _get(form, column.key, '')
        }
      </span>
    );
  };

  render() {
    const {
      columns,
      forms: {
        forms,
        limit,
        pagination: {
          page,
          numPages,
          total,
        },
        sort,
      },
      getForms,
      onAction,
      onPageSizeChanged,
      pageSizes,
      classes
    } = this.props;

    const skip = (page - 1) * limit;
    const last = Math.min(skip + limit, total);

    return (
      <Grid
        Cell={this.Cell}
        activePage={page}
        columns={columns}
        emptyText="无表单数据"
        firstItem={skip + 1}
        items={forms}
        lastItem={last}
        onAction={onAction}
        onPage={getForms}
        onPageSizeChanged={onPageSizeChanged}
        onSort={this.onSort}
        pageSize={limit}
        pageSizes={pageSizes}
        pages={numPages}
        sortOrder={sort}
        total={total}
        classes={classes}
      />
    );
  }
});
