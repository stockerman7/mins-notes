// 로컬 데이터 작업 참고 : https://www.apollographql.com/docs/react/essentials/local-state/
// Apollo Client (> = 2.5)에는 로컬 데이터를 원격 데이터와 함께 Apollo 캐시에 저장할 수있는 로컬 상태 처리 기능이 내장되어 있습니다.
import { ApolloClient } from "apollo-client"; // 모든 마술이 일어나는 곳?
import { InMemoryCache } from "apollo-cache-inmemory"; // 권장 캐시
import { withClientState } from "apollo-link-state";
import { ApolloLink } from "apollo-link";

import { typeDefs, defaults, resolvers } from "./clientState";

const cache = new InMemoryCache(); // 브라우저 캐시 조작을 위해 생성

// client 측 로컬 상태, 데이터 관리, Apollo Cache를 사용하려는 경우에 유용
const stateLink = withClientState({
	cache,
	defaults, // client 로컬 저장소 대한 초기 상태, 이전 저장소 목록 조회(여기선 캐시)
	typeDefs, // client 스키마 구성
	resolvers, // GraphQL 작업 수행을 위한 변경, 쿼리 함수(여기서는 로컬 변경, 쿼리)
});

// ApolloClient: 말 그대로 서버와 통신할 Client(로컬) 측 설정을 말한다.
// 흔히 apollo-boost 를 이용해 GraphQL 서버의 엔드 포인트(즉, 서버측 URL 주소)를 연결한다. 그러나 여기선 cache(로컬)가 엔드 포인트가 된다.
// 그리고 대화할 서버 측으로 client 정보를 넘긴다. -> export default client;
const client = new ApolloClient({
	//  캐시, 링크 정보를 연동 -> 반드시 ApolloClient 생성자로 전달
	cache,
	link: ApolloLink.from([stateLink]),
});

// default 키워드와 함께 export한 모듈은 {} 없이 임의의 이름으로 import한다.
export default client;
