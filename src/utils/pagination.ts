import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

// This means T is a generic type to specify a return type for function, so paginate() can work with any entity.
// Like users, products etc...
// It reduce duplications

export async function paginate<T extends ObjectLiteral>(
  queryBuilderOrRepository: SelectQueryBuilder<T> | Repository<T>,
  page: number,
  limit: number,
) {
  if (queryBuilderOrRepository instanceof SelectQueryBuilder) {
    // Use QueryBuilder logic
    const [items, total] = await queryBuilderOrRepository
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
  } else {
    // Use repository logic
    const [items, total] = await queryBuilderOrRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPage: Math.ceil(total / limit) };
  }
}
