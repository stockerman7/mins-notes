import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import { ApolloLink } from "apollo-link";

import { typeDefs, defaults, resolvers } from "./clientState";

const cache = new InMemoryCache();

const stateLink = withClientState({
	cache,
	typeDefs,
	defaults,
	resolvers,
});

const client = new ApolloClient({
	cache,
	link: ApolloLink.from([stateLink]),
});

// default 키워드와 함께 export한 모듈은 {} 없이 임의의 이름으로 import한다.
export default client;
