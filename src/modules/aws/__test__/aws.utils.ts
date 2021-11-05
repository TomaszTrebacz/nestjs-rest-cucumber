import faker from 'faker';
import { AssignFileResult } from '@/modules/aws/services/s3.service';
import { unknownUploadToken } from '@/test-utils/common.util';

export const createAssignFileResult = (
  data?: Partial<AssignFileResult>,
): AssignFileResult => ({
  filePath: unknownUploadToken(),
  fileName: faker.random.alphaNumeric(10),
  fileSize: faker.datatype.number({ min: 1, max: 1000000 }),
  mimeType: faker.system.mimeType(),
  ...data,
});
