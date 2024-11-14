export enum DOStatus {
  UNCHANGED = 1,
  UPDATED = 2,
  NEW = 3,
  DELETED = 4,
}

/**比较操作符 */
export type EOperatorCode =
  | 'equal'
  | 'like'
  | 'leftLike'
  | 'rightLike'
  | 'greaterThan'
  | 'lessThan'
  | 'in'
  | 'isNull'
  | 'notNull';

/**排序类型 */
export enum EDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**逻辑操作符 */
export type ELogicOperatorCode = 'and' | 'or';
