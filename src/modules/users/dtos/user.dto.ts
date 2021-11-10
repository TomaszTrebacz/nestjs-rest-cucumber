import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'ID of the user.',
  })
  @Expose()
  id!: string;

  @ApiProperty({
    type: 'date-time',
    description: 'Timestamp of the user creation.',
    example: '1970-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'Email of the user.' })
  @Expose()
  email!: string;

  @ApiProperty({ description: 'Full name of the user.' })
  @Expose()
  fullName!: string;

  @ApiProperty({ description: 'Indicates whether user is an admin.' })
  @Expose()
  isAdmin!: boolean;

  @ApiProperty({ description: 'Indicates whether user is already onboarded.' })
  @Expose()
  isOnboarded!: boolean;
}
