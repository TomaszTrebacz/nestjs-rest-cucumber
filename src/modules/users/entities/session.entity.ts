import { Entity, Property, ManyToOne, BlobType } from '@mikro-orm/core';
import { IdCreatedColumns } from '@/common/database/columns.entity';
import { PartiallyRequired } from '@/common/types';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Entity({ tableName: 'sessions' })
export class SessionEntity extends IdCreatedColumns {
  @Property({ type: BlobType, unique: true })
  token: Buffer;

  @Property({ type: 'date', length: 3 })
  expiresAt: Date;

  @ManyToOne({ entity: () => UserEntity, onDelete: 'cascade' })
  user: UserEntity;

  constructor(
    data: PartiallyRequired<SessionEntity, 'token' | 'expiresAt' | 'user'>,
  ) {
    super(data);
    this.token = data.token;
    this.expiresAt = data.expiresAt;
    this.user = data.user;
  }
}
