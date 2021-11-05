import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { IdCreatedColumns } from '@/common/database/columns.entity';
import { PartiallyRequired } from '@/common/types';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Entity({ tableName: 'organizations' })
export class OrganizationEntity extends IdCreatedColumns {
  @Property({ columnType: 'citext', unique: true })
  name: string;

  @OneToMany({
    entity: () => UserEntity,
    mappedBy: (user) => user.organization,
  })
  users = new Collection<UserEntity>(this);

  constructor(data: PartiallyRequired<OrganizationEntity, 'name'>) {
    super(data);
    this.name = data.name;
  }
}
