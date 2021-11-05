import { EntityManager, SqlEntityRepository } from '@mikro-orm/postgresql';
import { INestApplication } from '@nestjs/common';

// In case if you need enforce some type on random input
// type UserInput = Pick<UserEntity, 'email'>;
//
// export const setupRandomUser = randomEntityData<UserEntity, UserInput>(
//     UserEntity,
//     randomUserInput,
// );

export const randomEntityData =
  <Entity, Input = void | Partial<Entity>>(
    entity: new (...args: never) => Entity,
    randomInput?: () => Partial<Entity>,
  ) =>
  (appFn: () => INestApplication) => {
    return {
      async many(inputs: Input[]): Promise<Entity[]> {
        const app = appFn();
        const em = app.get(EntityManager);
        const entityRepository = em.getRepository(
          entity,
        ) as SqlEntityRepository<Entity>;

        const entities = inputs.map((input) =>
          entityRepository.create({ ...randomInput?.(), ...input }),
        );

        await entityRepository.persistAndFlush(entities);

        return entities;
      },

      async one(input: Input): Promise<Entity> {
        const results = await this.many([input]);

        return results[0];
      },

      async some(amount: number, input: Input): Promise<Entity[]> {
        const inputs = Array.from({ length: amount }, () => input);

        return await this.many(inputs);
      },
    };
  };
