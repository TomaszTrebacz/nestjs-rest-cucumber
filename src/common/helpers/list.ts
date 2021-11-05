// import { FindOptions } from '@mikro-orm/core';
// import { Knex } from '@mikro-orm/postgresql';
// import { Type as ClassType } from '@nestjs/common';
// import {
//   ArgsType,
//   Field,
//   ObjectType,
//   InputType,
//   Int,
//   registerEnumType,
// } from '@nestjs/graphql';
// import { Type } from 'class-transformer';
// import { IsInt, Min, Max } from 'class-validator';
// import { Nullable } from '@/common/types';
//
// export enum SortDirection {
//   ASC = 'ASC',
//   DESC = 'DESC',
// }
//
// registerEnumType(SortDirection, {
//   name: 'SortDirection',
// });
//
// type SortData = {
//   field: string;
//   direction: SortDirection;
//   column: string;
// };
//
// export type ListData = {
//   page: number;
//   perPage: number;
//   sort: SortData;
// };
//
// export const ListArgs = (
//   nodeName: string,
//   sortMap: Record<string, string>,
//   defaultSortField: string,
// ) => {
//   const sortFields = Object.keys(sortMap);
//   const sortFieldsMap = Object.fromEntries(
//     sortFields.map((field) => [field, field]),
//   );
//
//   registerEnumType(sortFieldsMap, {
//     name: `${nodeName}SortField`,
//   });
//
//   @InputType(`${nodeName}Sort`, { isAbstract: true })
//   class Sort implements SortData {
//     @Field(() => sortFieldsMap, {
//       description: 'The field to sort results by.',
//     })
//     field!: string;
//
//     @Field(() => SortDirection, { description: 'The sort direction.' })
//     direction!: SortDirection;
//
//     get column() {
//       return sortMap[this.field];
//     }
//   }
//
//   @ArgsType()
//   class List implements ListData {
//     @Field(() => Int, {
//       nullable: true,
//       description: 'Page number (default: 1).',
//     })
//     @IsInt()
//     @Min(1)
//     page: number = 1;
//
//     @Field(() => Int, {
//       nullable: true,
//       description: 'Number of nodes to list per page (default: 10, max 100).',
//     })
//     @IsInt()
//     @Min(1)
//     @Max(100)
//     perPage: number = 10;
//
//     @Field(() => Sort, {
//       defaultValue: { field: defaultSortField, direction: SortDirection.ASC },
//     })
//     @Type(() => Sort)
//     sort!: Sort;
//   }
//
//   return List;
// };
//
// export type PaginationData<T> = { totalCount: number; nodes: T[] };
//
// export const PaginationModel = <NodeType>(classRef: ClassType<NodeType>) => {
//   @ObjectType(`${classRef.name}Pagination`, { isAbstract: true })
//   abstract class Pagination implements PaginationData<NodeType> {
//     @Field({
//       description:
//         'The total number of results, regardless of page and perPage arguments.',
//     })
//     totalCount!: number;
//
//     @Field(() => [classRef], {
//       description: 'List of nodes that matched the query.',
//     })
//     nodes!: NodeType[];
//   }
//
//   return Pagination;
// };
//
// export const getListOptions = <T>(args: ListData): FindOptions<T> => {
//   return {
//     orderBy: { [args.sort.column]: args.sort.direction },
//     limit: args.perPage,
//     offset: (args.page - 1) * args.perPage,
//   };
// };
//
// export const applyKnexQueryListOptions = (
//   query: Knex.QueryBuilder,
//   args: ListData,
// ): void => {
//   query
//     .orderBy(args.sort.column, args.sort.direction)
//     .limit(args.perPage)
//     .offset((args.page - 1) * args.perPage);
// };
//
// export const createAncestorsList = <T extends { parent: Nullable<T> }>(
//   node: T,
// ): T[] => {
//   const ancestors: T[] = [];
//   let currentNode = node.parent;
//
//   while (currentNode !== null) {
//     ancestors.unshift(currentNode);
//
//     currentNode = currentNode.parent;
//   }
//
//   return ancestors;
// };
