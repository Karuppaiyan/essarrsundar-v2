// amplifyConfig.js
import { Amplify } from "aws-amplify";
import amplifyOutputs from "../../amplify_outputs.json"; // Adjust the path as needed to point to your amplify outputs file

// Configure Amplify with your backend outputs
Amplify.configure({
  Auth: {
     Cognito: {
    region: amplifyOutputs.auth.aws_region,
    userPoolId: amplifyOutputs.auth.user_pool_id,
    userPoolWebClientId: amplifyOutputs.auth.user_pool_client_id,
    identityPoolId: amplifyOutputs.auth.identity_pool_id,

    loginWith: {
        oauth: {
          domain: 'your-cognito-domain',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:3000/'],
          redirectSignOut: ['http://localhost:3000/'],
          responseType: 'code',
        }
      }
       }
  },
  API: {
    aws_appsync_graphqlEndpoint: amplifyOutputs.data.url,
    aws_appsync_region: amplifyOutputs.data.aws_region,
    aws_appsync_authenticationType: amplifyOutputs.data.default_authorization_type,
  },
});
