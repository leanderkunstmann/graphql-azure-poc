import { ApolloServer, BaseContext } from "@apollo/server";
import { startServerAndCreateHandler } from '@as-integrations/azure-functions';

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Rule {
    source_ip: String
    soure_port: String
    souce_group: String
    soure_desc: String
    target_ip: String
    target_port: String
    target_group: String
    target_desc: String
    protocol: String
    subscription: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  
  type Query {
    getRulesDev(subscription: String, amount: Int): [Rule]
    getRules(subscription: String, token: String): [Rule]
  }
`;


type Rule = {
  source_ip: String
  soure_port: String
  souce_group: String
  soure_desc: String
  target_ip: String
  target_port: String
  target_group: String
  target_desc: String
  protocol: String
  subscription: String
}

type devArgs = {
  subscription: String
  amount: Number
}

function createFakeRules(subscription:String, n:number){

  function getRandomInt(max:number):string {
    return Math.floor(Math.random() * max).toString();
  }

  let protocols:Array<String> = ["TCP", "UDP", "ICMP"]
  
  let fakeRules:Array<Rule> = []
  for (let i:number = n; i>0 ; i--){
    fakeRules.push(
      {
        source_ip: "7.7.7." + getRandomInt(i),
        soure_port: "18" + getRandomInt(i),
        souce_group: "test" + getRandomInt(i),
        soure_desc: "test" + getRandomInt(i),
        target_ip: "7.6.7." + getRandomInt(i),
        target_port: "2" + getRandomInt(i),
        target_group: "test" + getRandomInt(i),
        target_desc: "test" + getRandomInt(i),
        protocol:  protocols[parseInt(getRandomInt(2))],
        subscription: subscription
      },
    )
  }
  return fakeRules
}

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
      getRulesDev: (_:string,args:devArgs) => createFakeRules(args.subscription, parseInt(args.amount.toString()))
    },
    
  };

const server:ApolloServer<BaseContext> = new ApolloServer({
    typeDefs,
    resolvers
  });
  

export default startServerAndCreateHandler(server);