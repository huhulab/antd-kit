

export class ApiQuery {
  constructor(page, perpage, filters, sort) {
    this.page = page === undefined ? 1 : page;
    this.perpage = perpage === undefined  ? 20 : perpage;
    this.filters = filters === undefined ? [] : filters;
    this.sort = sort === undefined ? [] : sort;
  }

  updateFilter(name, operation, value) {
    // console.log('updateFilter', name, operation, value);
    let newFilters = [];
    let matched = false;
    if ((operation == "ilike" || operation == "like")
        && (value !== undefined && value !== "")) {
      value = `%${value}%`;
    }

    this.filters.forEach(function(item) {
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

  updateSort(name, order) {
    let newSort = []
    let matched = false;
    this.sort.forEach(function(item) {
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

  dict() {
    return {
      type: this.type,
      page: this.page,
      perpage: this.perpage,
      filters: this.filters,
      sort: this.sort,
    };
  }
}
