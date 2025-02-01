import { Module } from '@nestjs/common';

import { GraphqlService } from './graphql.service';

@Module({
  exports: [GraphqlService],
  providers: [GraphqlService],
})
export class GraphqlModule {}
