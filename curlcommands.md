[cloudshell-user@ip-10-2-54-91 ~]$ CTYPE='Content-Type: application/json'
[cloudshell-user@ip-10-2-54-91 ~]$ BOOK='{"title":"A Tale", "author":"guy", "genre":"Classics"}'
[cloudshell-user@ip-10-2-54-91 ~]$ API=0z1u25saxa.execute-api.us-east-1.amazonaws.com

curl -v https://$API/Books -H "$CTYPE" -d "$BOOK"
add | js 
in order for it to format as a json styling

curl https://$API/Books -H "$CTYPE" -d "$BOOK" | jq '.book_id'