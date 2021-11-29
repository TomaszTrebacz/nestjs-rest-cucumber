import { QueryBuilder } from '@mikro-orm/postgresql';
import { Type as ClassType } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsEnum, IsIn } from 'class-validator';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type ListQueryParam = {
  page: number;
  perPage: number;
  sortDir: SortDirection;
  sortByValue: string;
};

type PaginatedEntity<T> = {
  totalCount: number;
  nodes: T[];
};

export const createListQueryParamDto = (
  sortMap: Record<string, string>,
  defaultSortField: string,
) => {
  const sortKeys = Object.keys(sortMap);

  class ListQueryParamDto implements ListQueryParam {
    @ApiProperty({
      required: false,
      type: 'integer',
      default: 1,
      minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiProperty({
      required: false,
      type: 'integer',
      default: 10,
      minimum: 1,
      maximum: 100,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    perPage: number = 10;

    @ApiProperty({
      required: false,
      enum: SortDirection,
      default: SortDirection.DESC,
    })
    @IsEnum(SortDirection)
    sortDir: SortDirection = SortDirection.DESC;

    @ApiProperty({
      required: false,
      enum: sortKeys,
      default: defaultSortField,
    })
    @IsIn(sortKeys)
    private sortBy: string = defaultSortField;

    get sortByValue() {
      return sortMap[this.sortBy];
    }
  }

  return ListQueryParamDto;
};

export const createListDto = <Entity, NodeType = void>(
  classRef: ClassType<NodeType>,
) => {
  class ListDto {
    @ApiProperty({
      type: 'integer',
      description:
        'The total number of results, regardless of page and perPage arguments.',
      minimum: 0,
    })
    totalCount: number;

    @ApiProperty({
      type: [classRef],
      description: 'List of nodes that matched the query.',
    })
    @Type(() => classRef)
    nodes: NodeType[];

    constructor(data: PaginatedEntity<Entity>) {
      this.totalCount = data.totalCount;
      this.nodes = data.nodes.map((node) => new classRef(node));
    }
  }

  return ListDto;
};

export const returnPaginatedResult = async <T>(
  query: QueryBuilder<T>,
  queryParam: ListQueryParam,
): Promise<PaginatedEntity<T>> => {
  const clonedQuery = query.clone();

  query
    .orderBy({ [queryParam.sortByValue]: queryParam.sortDir })
    .limit(queryParam.perPage)
    .offset((queryParam.page - 1) * queryParam.perPage);

  const [nodes, { totalCount }] = await Promise.all([
    query.getResultList(),
    clonedQuery.select('count(*)::int as "totalCount"').execute('get'),
  ]);

  return { totalCount, nodes };
};
