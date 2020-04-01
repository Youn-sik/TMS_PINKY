const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const app = express();
const port = 5000;

mongoose.connect('mongodb+srv://wjs4222:0000@localhost:27017', { dbName: 'user' }, function(err) {});

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
})

let User =  mongoose.model('user', UserSchema);

const typeDefs = `
    type Query {
        allUser : [User]
    }

    type User {
        id : String
        password : String
    }
`;

let resolvers = {
    Query: {
        allUser() {
            return User.find();
        }
    }
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});



app.get('/',(req,res)=>res.send("test"));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));
app.listen(port, () => console.log(`app listening on port ${port}`));