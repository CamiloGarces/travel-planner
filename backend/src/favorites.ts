import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { json, userId } from './http';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TableName = process.env.FAVORITES_TABLE!;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const user = userId(event);
    const method = event.requestContext.http.method;

    if (method === 'GET') {
      const result = await db.send(
        new QueryCommand({
          TableName,
          KeyConditionExpression: 'userId = :u',
          ExpressionAttributeValues: { ':u': user },
        }),
      );

      return json(200, { items: result.Items ?? [] });
    }

    if (method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : null;

      if (!body?.id || !body?.name || !body?.country) {
        return json(400, { message: 'Invalid destination' });
      }

      const item = {
        ...body,
        userId: user,
        destinationId: Number(body.id),
        createdAt: new Date().toISOString(),
      };

      await db.send(
        new PutCommand({
          TableName,
          Item: item,
        }),
      );

      return json(201, { item });
    }

    if (method === 'DELETE') {
      const destinationId = Number(event.pathParameters?.destinationId);

      if (!Number.isFinite(destinationId)) {
        return json(400, { message: 'Invalid destination id' });
      }

      await db.send(
        new DeleteCommand({
          TableName,
          Key: { userId: user, destinationId },
        }),
      );

      return { statusCode: 204, body: '' };
    }

    return json(405, { message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return json(500, { message: 'Favorites request failed' });
  }
};
