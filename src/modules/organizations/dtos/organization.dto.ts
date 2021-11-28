import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { createListDto } from '@/common/helpers/list';
import { IsTrimmed } from '@/common/validators';
import { OrganizationEntity } from '@/modules/organizations/entities/organization.entity';
import { ORGANIZATION_VALIDATION } from '@/modules/organizations/organizations.constant';

export const OrganizationIdApiProperty = () =>
  ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'ID of the organization.',
  });

export const OrganizationNameApiProperty = () =>
  ApiProperty({
    type: 'string',
    minLength: ORGANIZATION_VALIDATION.NAME.MIN_LENGTH,
    maxLength: ORGANIZATION_VALIDATION.NAME.MAX_LENGTH,
    description: 'Name of the organization.',
  });

export const IsOrganizationNameValid = () =>
  applyDecorators(
    IsString(),
    MinLength(ORGANIZATION_VALIDATION.NAME.MIN_LENGTH),
    MaxLength(ORGANIZATION_VALIDATION.NAME.MAX_LENGTH),
    IsTrimmed(),
  );

export class OrganizationIdPathParamDto {
  @OrganizationIdApiProperty()
  @IsUUID()
  organizationId!: string;
}

export class OrganizationResponseDto {
  @OrganizationIdApiProperty()
  id: string;

  @ApiProperty({
    type: 'date-time',
    description: 'Timestamp of the organization creation.',
    example: '1970-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @OrganizationNameApiProperty()
  name: string;

  constructor(data: OrganizationEntity) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.name = data.name;
  }
}

export class PaginatedOrganizationResponseDto extends createListDto<OrganizationEntity>(
  OrganizationResponseDto,
) {}
