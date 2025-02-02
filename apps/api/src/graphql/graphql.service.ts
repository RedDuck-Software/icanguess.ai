import {
  ApolloClient,
  ApolloQueryResult,
  DocumentNode,
  HttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class GraphqlService {
  private readonly logger = new Logger(GraphqlService.name);

  public async getQueryResult<TResult>(
    uri: string,
    query: DocumentNode,
    variables?: any,
  ): Promise<TResult> {
    const client = this._createClient(uri);

    let response: ApolloQueryResult<TResult>;

    try {
      response = await client.query({ query, variables });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;

      this.logger.warn({
        message: `Unexpected error during Apollo query: '${message}'`,
        stack: stack ?? 'No stack trace available',
        error,
      });
      throw new InternalServerErrorException(
        'Something went, please try again later.',
      );
    }

    if (response.errors && response.errors.length > 0) {
      const errorMessages = response.errors
        .map((err) => err.message)
        .join(', ');
      this.logger.warn(`GraphQL query errors: ${errorMessages}`);
      throw new InternalServerErrorException(
        'Something went, please try again later.',
      );
    }

    return response.data;
  }

  private _createClient(uri: string) {
    return new ApolloClient({
      link: new HttpLink({ uri }),
      cache: new InMemoryCache(),
    });
  }
}
