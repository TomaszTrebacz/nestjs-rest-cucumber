import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CONFIG } from '@/config';

@Controller()
@ApiTags('App')
export class GetAppStatusEndpoint {
  @Get()
  @ApiOperation({ description: 'Check application health and version' })
  @ApiOkResponse()
  async getAppStatus() {
    return {
      message: 'OK',
      version: CONFIG.APP.VERSION,
      buildTimestamp: CONFIG.APP.BUILD_TIMESTAMP,
    };
  }
}
