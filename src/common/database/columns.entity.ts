import { randomUUID } from 'crypto';
import { PrimaryKey, Property } from '@mikro-orm/core';
import { setDefault } from '@/common/utils';

export abstract class IdColumn {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  protected constructor(data: Partial<IdColumn>) {
    this.id = setDefault(data.id, randomUUID());
  }
}
export abstract class IdCreatedColumns extends IdColumn {
  @Property({ type: 'date', length: 3, defaultRaw: 'now()' })
  createdAt: Date;

  protected constructor(data: Partial<IdCreatedColumns>) {
    super(data);
    this.createdAt = setDefault(data.createdAt, new Date());
  }
}
