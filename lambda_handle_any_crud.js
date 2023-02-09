import DynamoDB from "@aws-sdk/client-dynamodb";
import DynamoDBLib from "@aws-sdk/lib-dynamodb";
const {DynamoDBClient} = DynamoDB

const dynoClient = new DynamoDBClient({region: 'us-east-1'});

export const handler = async(event) => {
    switch(event.httpMethod) {
        case 'GET':
            const getCommand = new DynamoDBLib.GetCommand({
                TableName: "Books",
                Key: {
                    book_id: event.pathParameters.book_id
                }
            });
            const item = await dynoClient.send(getCommand);
            const response = {
                statusCode: 200,
                body: JSON.stringify(item.Item)
            };
            return response;
        case 'POST':
            const book = JSON.parse(event.body);
            book.book_id = String(Math.ceil(Math.random() * 100000000));
            
            const postCommand = new DynamoDBLib.PutCommand({
                TableName: "Books",
                Item: book
            });
            
            await dynoClient.send(postCommand);
            
            const postResponse = {
                statusCode: 200,
                body: JSON.stringify(book)
            };
            return postResponse;
        case 'PUT':
            const updateCommand = new DynamoDBLib.UpdateCommand({
                TableName: "Books",
                Key: {
                    book_id: event.pathParameters.book_id
                },
                UpdateExpression: 'set #f = :title, #u = :author, #c = :genre',
                ExpressionAttributeNames: {
                    '#f': 'title',
                    '#u': 'author',
                    '#c': 'genre',
                },
                ExpressionAttributeValues: {
                    ':title': JSON.parse(event.body).title,
                    ':author': JSON.parse(event.body).author,
                    ':genre': JSON.parse(event.body).genre,
                }
            });
            await dynoClient.send(updateCommand);
            const updateResponse = {
                statusCode: 200,
                body: 'Fixd'
            };
            return updateResponse;
        case 'DELETE':
            const deleteCommand = new DynamoDBLib.DeleteCommand({
                TableName: "Books",
                Key: {
                    book_id: event.pathParameters.book_id
                }
            });
            await dynoClient.send(deleteCommand);
            const deleteResponse = {
                statusCode: 200,
                body: 'Shit is gone yo'
            };
            return deleteResponse;
        default:
            const errorResponse = {
                statusCode: 400,
                body: 'Only CRUD is allowed because I dont know what the others are and I didnt code them'
            };
            return errorResponse;
    }
}
