import { SetMetadata } from '@nestjs/common';

// The decorator configures the metadata during application startup,
// and the guard retrieves that metadata during the request lifecycle.
export const HasPermission = (access: string) => SetMetadata('access', access);
