const buildFilterObj = (queryParams) => {
  const filter = {};
  const { search, status, category, priority } = queryParams;

  if (search) {
    filter.name = {
      $regex: search,
      $options: 'i',
    };
  }

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;

  return filter;
};

export default buildFilterObj;
