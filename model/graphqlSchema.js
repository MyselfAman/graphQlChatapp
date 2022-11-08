const {
    GraphQLSchema, 
    GraphQLString, 
    GraphQLObjectType, 
    GraphQLNonNull, 
    GraphQLID,
    GraphQLList,
    GraphQLInputObjectType

} = require("graphql");
const Message = require("./chat");
const user = require("./user");
const messageType = new GraphQLObjectType({
    name:"Message",
    fields:{
        username:{
            type: new GraphQLNonNull(GraphQLString)
        },
        message:{
            type: new GraphQLNonNull(GraphQLString)
        },
    },
})
const userType = new GraphQLObjectType({
    name:"User",
    fields:{
        _id:{
            type: new GraphQLNonNull(GraphQLID),
        },
        username:{
            type: new GraphQLNonNull(GraphQLString)
        },
        email:{
            type: new GraphQLNonNull(GraphQLString)
        },
        password:{
            type: new GraphQLNonNull(GraphQLString)
        }
    },
})
const userInputType = new GraphQLInputObjectType({
    name:"User",
    fields:{
        username:{
            type: new GraphQLNonNull(GraphQLString)
        },
        email:{
            type: new GraphQLNonNull(GraphQLString)
        },
        password:{
            type: new GraphQLNonNull(GraphQLString)
        }
    },
})

const chatType = new GraphQLObjectType({
    name:"User",
    fields:{       
        username:{
            type: new GraphQLNonNull(GraphQLString)
        },
        message:{
            type: new GraphQLNonNull(GraphQLString)
        }
    },
})


const rootMutation = new GraphQLSchema({
    name: "Mutation",
    fields: {
        createUser:{
            type: messageType,
            args:{
                username:{ 
                    type: new GraphQLNonNull(userInputType)
                },
                message:{ 
                    type: new GraphQLNonNull(userInputType)
                }
            },
            resolve: async(_, args) =>{
                try {
                    await Message.create(args);

                } catch (error) {
                    throw new Error(error.message);
                }
            }
        },
        createMessage:{
            type: userType,
            args:{
                user:{ 
                    type: new GraphQLNonNull(userInputType)
                }
            },
            resolve: async(_, args) =>{
                try {
                    await user.create(args);

                } catch (error) {
                    throw new Error(error.message);
                }
            }
        }
    }
})



const rootQuery = new GraphQLObjectType({
    name: "Query",
    fields: {
        chats:{
            type: GraphQLList(chatType),
            resolve: async() =>{
                try {
                    return await Messages.all(); // will return all the messages
                } catch (error) {
                    throw new Error(error.message);
                } 
            }
        },
    }
})



module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation
})

