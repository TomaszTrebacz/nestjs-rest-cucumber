import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OrganizationNameApiProperty } from '@/modules/organizations/organizations.constant';

export class OrganizationDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'ID of the organization.',
  })
  @Expose()
  id!: string;

  @ApiProperty({
    type: 'date-time',
    description: 'Timestamp of the organization creation.',
  })
  @Expose()
  createdAt!: Date;

  @OrganizationNameApiProperty()
  @Expose()
  name!: string;
}
