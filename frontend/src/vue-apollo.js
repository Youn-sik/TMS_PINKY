import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { setContext } from 'apollo-link-context'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'
// import jwt from 'jsonwebtoken';
Vue.use(VueApollo)

const AUTH_TOKEN = 'apollo-token'

const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://172.16.135.89:3000/graphiql'

const authLink = setContext(async (_, { headers }) => {
  const cookie = document.cookie.match('(^|;) ?' + "token" + '=([^;]*)(;|$)')
  const token = cookie === null ? '' : cookie[2] !== undefined ? cookie[2] : '';
  return {
    headers: {
      ...headers,
      authorization: token
    }
  }
})

const defaultOptions = {
  httpEndpoint,
  wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || null,
  tokenName: AUTH_TOKEN,
  persisting: false,
  websocketsOnly: false,
  ssr: false,
  link: authLink
}
export function createProvider (options = {}) {
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  })
  apolloClient.wsClient = wsClient
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
      },
    },
    errorHandler (error) {
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    },
  })

  return apolloProvider
}

export async function onLogin (apolloClient, token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token)
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

export async function onLogout (apolloClient) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN)
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}
