# AWS-API-Lambda
Deploying a CRUD API using AWS API Gateway and AWS Lambda

![lab18.jpg](https://i.postimg.cc/nr1BNy0x/lab18.jpg)

Provide a UML diagram showcasing the architecture of your API.

![Image](https://d2908q01vomqb2.cloudfront.net/22d200f8670dbdb3e253a90eee5098477c95c23d/2018/01/21/AR_Diagram_010418.png)

Document the data and program flow for your API, including the mapping of Routes and Functions, as well as the flow of data.

>The API Gateway handles the external request through transform and handing that event to the Lambda via my route. I configured my app with ANY and use a switch/case structure to handle the CRUD events and return an error for anything that isnt.

What is the root URL to your API?
> the root URL to my API is: https://0z1u25saxa.execute-api.us-east-1.amazonaws.com/Books

What are the routes?
> I only used the Any route.

What inputs do they require?
>depending on what function they are fulfilling they require the table name and an item (post) The body/key with the book_id (get), the body with the book idea and structured changes (update):

> this one is a little harder so im going to provide the code: 
```
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
```

> and the body/key with the book id (delete)

What output do they return?

>Get returns status code 200 with the item stringified in a JSON<br>

>Post returns status code 200 with the book stringified in a JSON<br>

>Put returns the status code 200 with the body "Fixd"<br>

>Delete returns the status code 200 with the body 'shit is gone yo'<br>

>Anything else will return with status 400 and a body of "Only CRUD is allowed because I dont know what the others are and I didnt code them"

```
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
```

