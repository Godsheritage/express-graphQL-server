const graphql = require("graphql");
const axios = require("axios")
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema } = graphql;

const users = [
  { id: "23", firstName: "Heritage", age: 20 },
  { id: "25", firstName: "David", age: 23 },
  { id: "26", firstName: "Adeoye", age: 25 },
]; 


let UserType;

const CompanyType = new GraphQLObjectType({
  name:"company",
  fields: () => ( {
    id:{type:GraphQLString},
    name:{type:GraphQLString},
    description:{type:GraphQLString},
    users:{
      type: new GraphQLList(UserType), 
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
        .then(res => res.data)
      }
    }
  })
})


UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company:{
      type:CompanyType,   
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
        .then(response => response.data)
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(response => response.data)
      },
    },
    company: {
      type: CompanyType,
      args:{id:{type:GraphQLString}},
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${args.id}`)
        .then(res => res.data)

      }
    }
  },
});


const muatation = new GraphQLObjectType({
  name:"Mutation",
  fields:{
    
  }
})



module.exports = new GraphQLSchema({
    query: RootQuery
})