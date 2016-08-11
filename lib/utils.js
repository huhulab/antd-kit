"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiQuery = exports.ApiQuery = function () {
  function ApiQuery(page, perpage, filters, sort) {
    _classCallCheck(this, ApiQuery);

    this.page = page === undefined ? 1 : page;
    this.perpage = perpage === undefined ? 20 : perpage;
    this.filters = filters === undefined ? [] : filters;
    this.sort = sort === undefined ? [] : sort;
  }

  _createClass(ApiQuery, [{
    key: "updateFilter",
    value: function updateFilter(name, operation, value) {
      // console.log('updateFilter', name, operation, value);
      var newFilters = [];
      var matched = false;
      if ((operation == "ilike" || operation == "like") && value !== undefined && value !== "") {
        value = "%" + value + "%";
      }

      this.filters.forEach(function (item) {
        if (item[0] === name && item[1] === operation) {
          matched = true;
          if (value !== undefined && value !== "") {
            newFilters.push([name, operation, value]);
          }
        } else {
          newFilters.push(item);
        }
      });

      if (!matched && value !== undefined && value !== "") {
        newFilters.push([name, operation, value]);
      }
      // console.log('newFilters:', newFilters);
      this.filters = newFilters;
    }
  }, {
    key: "updateSort",
    value: function updateSort(name, order) {
      var newSort = [];
      var matched = false;
      this.sort.forEach(function (item) {
        if (item[0] === name) {
          matched = true;
          if (order !== undefined) {
            newSort.push([name, order]);
          }
        } else {
          newSort.push(item);
        }
      });
      if (!matched && order !== undefined) {
        newSort.push([name, order]);
      }
      this.sort = newSort;
    }
  }, {
    key: "dict",
    value: function dict() {
      return {
        type: this.type,
        page: this.page,
        perpage: this.perpage,
        filters: this.filters,
        sort: this.sort
      };
    }
  }]);

  return ApiQuery;
}();