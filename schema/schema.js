const graphql = require("graphql");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

let URLPath = "http://localhost:3000"





//OBJECT MODELS
const CompanyType = new GraphQLObjectType({
  name: "company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`${URLPath}/companies/${parentValue.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`${URLPath}/companies/${parentValue.companyId}`)
          .then((response) => response.data);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`${URLPath}/users/${args.id}`)
          .then((response) => response.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`${URLPath}/companies/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, {firstName, age}) {
        return axios.post(`${URLPath}/users`,{firstName, age})
        .then(res => res.data)
      },
    },
    
    deleteUser:{
      type:UserType,
      args:{id:{type: new GraphQLNonNull(GraphQLString)}}, 
      resolve(parentValue, args){
        return axios.delete(`${URLPath}/users/${args.id}`)
        .then(res => res.data)
      }
    },

    editUser:{
      type:UserType,
      args:{
        id:{type: new GraphQLNonNull(GraphQLString)},
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, {id, firstName, age, companyId}){
        return axios.patch(`${URLPath}/users/${id}`, {id, firstName, age, companyId})
        .then(res => res.data)
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
