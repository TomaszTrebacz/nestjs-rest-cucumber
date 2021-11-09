import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { createListDto } from '@/common/helpers/list';
import { OrganizationNameApiProperty } from '@/modules/organizations/organizations.constant';

export class OrganizationIdDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'ID of the organization.',
  })
  @IsUUID()
  organizationId!: string;
}

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
    example: '1970-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

  @OrganizationNameApiProperty()
  @Expose()
  name!: string;
}

export class PaginatedOrganizationDto extends createListDto(OrganizationDto) {}
