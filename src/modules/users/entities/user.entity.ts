import {
  Entity,
  Property,
  OneToMany,
  Collection,
  BlobType,
  ManyToOne,
  Enum,
} from '@mikro-orm/core';
import { IdCreatedColumns } from '@/common/database/columns.entity';
import { Nullable, PartiallyRequired } from '@/common/types';
import { setDefault } from '@/common/utils';
import { SessionEntity } from '@/modules/auth/entities/session.entity';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import { UserType } from '@/modules/users/users.constant';

@Entity({ tableName: 'users' })
export class UserEntity extends IdCreatedColumns {
  @Property({ columnType: 'citext', unique: true })
  email: string;

  @Property({ type: 'text', nullable: true })
  password: Nullable<string>;

  @Property({ type: 'text', default: '' })
  fullName: string;

  @Enum({ items: () => UserType, default: UserType.STANDARD })
  type: UserType;

  @Property({ type: BlobType, nullable: true, unique: true })
  resetPasswordToken: Nullable<Buffer>;

  @Property({ type: 'date', length: 3, nullable: true })
  resetPasswordExpiresAt: Nullable<Date>;

  @ManyToOne({
    nullable: true,
    entity: () => OrganizationEntity,
    onDelete: 'set null',
  })
  organization: Nullable<OrganizationEntity>;

  constructor(data: PartiallyRequired<UserEntity, 'email'>) {
    super(data);
    this.email = data.email;
    this.password = setDefault(data.password, null);
    this.fullName = setDefault(data.fullName, '');
    this.type = setDefault(data.type, UserType.STANDARD);
    this.resetPasswordToken = setDefault(data.resetPasswordToken, null);
    this.resetPasswordExpiresAt = setDefault(data.resetPasswordExpiresAt, null);
    this.organization = setDefault(data.organization, null);
  }

  @OneToMany({
    entity: () => SessionEntity,
    mappedBy: (session) => session.user,
  })
  sessions = new Collection<SessionEntity>(this);
}
