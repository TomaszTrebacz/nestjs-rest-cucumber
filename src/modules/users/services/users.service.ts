import { FilterQuery } from '@mikro-orm/core';
import { EntityManager, QueryBuilder } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { USERS_ERROR } from '@/modules/users/users.constant';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async findOneByIdOrThrow(id: string): Promise<UserEntity> {
    const user = await this.em.findOne(UserEntity, id);

    if (!user) {
      throw 'a';
      // throw USERS_ERROR.ID_NOT_FOUND;
    }

    return user;
  }
}
