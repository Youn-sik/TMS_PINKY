import express from 'express';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { makeExecutableSchema } from 'graphql-tools';
const app = express();
const port = 3000;

mongoose.connect('mongodb://kool:master@localhost:27017/users', { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    console.log("mongoDB connected");
});

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

let User =  mongoose.model('users', UserSchema);

const typeDefs = `
    type Query {
        getUser(id:String,password:String):User
        allUser : [User]
    }

    type User {
        id : String
        password : String
    }

    input UserInput {
        id : String
        password : String
    }

    type Mutation {
        createUser(input: UserInput): User
    }
`;

let resolvers = {
    Query: {
        allUser() {
            return User.find();
        },
        getUser(root,{id,password}){
            let user = User.findOne({id})
            .then((result) => {
                if(result.password === password){
                    let token = jwt.sign({
                        id:result.id
                        },
                        'jjh',
                        {
                            expiresIn:'5m'
                        }
                    )
                    return {"id":token}
                } else {
                    return new Error("password Error");
                }
            });
            return user;
        }
    },
    Mutation: {
        createUser(root,{input}){
            return User.create(input);
        } 
    }
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

app.use(cors());
app.get('/',(req,res)=>res.send("test"));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

  
app.listen(port, () => console.log(`app listening on port ${port}`));