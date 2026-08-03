// Generic query-string -> Mongoose query translator used by every resource.
//
// Supported query params:
//   ?field=value            exact match
//   ?field[gte]=5           gte/gt/lte/lt operators
//   ?search=term            regex search across `searchableFields`
//   ?sort=field,-otherField sort ascending / descending (- prefix)
//   ?fields=a,b,c           limit returned fields
//   ?page=2&limit=25        pagination (default limit 25, max 200)
class APIFeatures {
  constructor(query, queryString, searchableFields = []) {
    this.query = query;
    this.queryString = queryString;
    this.searchableFields = searchableFields;
  }

  filter() {
    const excluded = ["page", "sort", "limit", "fields", "search"];
    const queryObj = { ...this.queryString };
    excluded.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    if (this.queryString.search && this.searchableFields.length > 0) {
      const term = this.queryString.search.trim();
      if (term) {
        const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        this.query = this.query.find({
          $or: this.searchableFields.map((field) => ({ [field]: regex })),
        });
      }
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(this.queryString.limit, 10) || 25, 1), 200);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = APIFeatures;
