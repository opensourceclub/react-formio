import _get from 'lodash/get';
import _isObject from 'lodash/isObject';
import _isString from 'lodash/isString';
import PropTypes from 'prop-types';
import React from 'react';

import {defaultPageSizes} from '../constants';
import {AllItemsPerPage, PageSizes} from '../types';

import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Pagination from './Pagination';

function normalizePageSize(pageSize) {
  if (_isObject(pageSize)) {
    return pageSize;
  }

  if (pageSize === AllItemsPerPage) {
    return {
      label: '全部',
      value: 999999,
    };
  }

  return {
    label: pageSize,
    value: pageSize,
  };
}

const renderPagination = ({
  pages,
  onPage,
}) => pages && onPage;

const renderPageSizeSelector = ({
  pageSize,
  pageSizes,
  onPageSizeChanged,
}) => pageSize && pageSizes && pageSizes.length && onPageSizeChanged;

const renderItemCounter = ({
  firstItem,
  lastItem,
  total,
}) => firstItem && lastItem && total;

const renderFooter = (props) => renderPagination(props) || renderItemCounter(props);

function Grid(props) {
  const {
    Cell,
    activePage,
    columns,
    emptyText,
    firstItem,
    items,
    lastItem,
    onAction,
    onPage,
    onPageSizeChanged,
    onSort,
    pageNeighbours,
    pageSize,
    pageSizes,
    pages,
    sortOrder,
    total,
    classes
  } = props;
  const normalizedPageSizes = pageSizes.map(normalizePageSize);
  window.console.log(classes);
  return (
    <Paper className={classes.grid}>
      {
        items.length
          ? (
            <React.Fragment>
            <Table>
              <TableHead>
                <TableRow>
                  {
                    columns.map((column) => {
                      const {
                        key,
                        sort = false,
                        title = '',
                        width,
                      } = column;
                      const className = `col col-md-${width}`;

                      const columnProps = {
                        key,
                        // className,
                      };

                      if (!title) {
                        return (
                          <TableCell {...columnProps} />
                        );
                      }

                      if (!sort) {
                        return (
                          <TableCell {...columnProps}>
                            <strong>{title}</strong>
                          </TableCell>
                        );
                      }

                      const sortKey = _isString(sort) ? sort : key;
                      const ascSort = sortKey;
                      const descSort = `-${sortKey}`;

                      let sortClass = '';
                      if (sortOrder === ascSort) {
                        sortClass = 'glyphicon glyphicon-triangle-top fa fa-caret-up';
                      }
                      else if (sortOrder === descSort) {
                        sortClass = 'glyphicon glyphicon-triangle-bottom fa fa-caret-down';
                      }

                      return (
                        <TableCell {...columnProps}>
                          <span
                            style={{cursor: 'pointer'}}
                            onClick={() => onSort(column)}
                          >
                            <strong>{title} <span className={sortClass}/></strong>
                          </span>
                        </TableCell>
                      );
                    })
                  }
                </TableRow>
              </TableHead>
              <TableBody>
              {
                items.map(item => (
                  <TableRow  key={item._id} onClick={() => onAction(item, 'row')}>
                      {
                        columns.map((column) => (
                          <TableCell key={column.key}>
                            <Cell row={item} column={column} />
                          </TableCell>
                        ))
                      }
                  </TableRow>
                ))
              }
              </TableBody>
            </Table>
            {
              renderFooter(props)
                ? (
                  <div className="MuiToolbar-root MuiToolbar-regular MuiTablePagination-toolbar MuiToolbar-gutters">
                      {
                        renderPagination(props)
                          ? (
                            <div className="col-auto" style={{paddingTop: 20}}>
                              <div className="row">
                                <div className="col-auto">
                                  <Pagination
                                    pages={pages}
                                    activePage={activePage}
                                    pageNeighbours={pageNeighbours}
                                    prev="前一页"
                                    next="后一页"
                                    onSelect={onPage}
                                  />
                                </div>
                                {
                                  renderPageSizeSelector(props)
                                    ? (
                                      <div className="col-auto">
                                        <div className="row">
                                          <div className="col-auto">
                                            <select
                                              className="form-control"
                                              value={pageSize}
                                              onChange={(event) => onPageSizeChanged(event.target.value)}
                                            >
                                              {
                                                normalizedPageSizes.map(({
                                                  label,
                                                  value,
                                                }) => (
                                                  <option key={value} value={value}>{label}</option>
                                                ))
                                              }
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                    : null
                                }
                                {
                                  renderItemCounter(props)
                                    ? (
                                      <div className="col-auto ml-auto">
                                        <span className="item-counter pull-right">
                                          <span className="page-num">{ firstItem } - { lastItem }</span> / { total } 全部
                                        </span>
                                      </div>
                                    )
                                    : null
                                }
                              </div>
                            </div>
                          )
                          : null
                      }
                  </div>
                )
                : null
            }
          </React.Fragment>
          )
          : <div style={{padding: '1rem 1.4rem'}}>{emptyText}</div>
      }
    </Paper>
  );
}

Grid.propTypes = {
  Cell: PropTypes.func,
  activePage: PropTypes.number,
  columns: PropTypes.array.isRequired,
  emptyText: PropTypes.string,
  firstItem: PropTypes.number,
  items: PropTypes.array.isRequired,
  lastItem: PropTypes.number,
  onAction: PropTypes.func,
  onPage: PropTypes.func,
  onPageSizeChanged: PropTypes.func,
  onSort: PropTypes.func,
  pageNeighbours: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizes: PageSizes,
  pages: PropTypes.number,
  sortOrder: PropTypes.string,
  total: PropTypes.number,
  classes: PropTypes.object
};

Grid.defaultProps = {
  Cell: ({
    column,
    row,
  }) => (
    <span>{_get(row, column.key, '')}</span>
  ),
  activePage: 1,
  emptyText: 'No data found',
  firstItem: 0,
  lastItem: 0,
  onAction: () => {},
  onPage: () => {},
  onPageSizeChanged: () => {},
  onSort: () => {},
  pageNeighbours: 1,
  pageSize: 0,
  pageSizes: defaultPageSizes,
  pages: 0,
  sortOrder: '',
  total: 0,
  classes: {}
};

// export default Grid;
export default Grid;
