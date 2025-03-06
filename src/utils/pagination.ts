import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

// This means T is a generic type to specify a return type for function, so paginate() can work with any entity.
// Like users, products etc...
// It reduce duplications

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number,
  limit: number,
) {
  const [items, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    items,
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit),
  };
}
