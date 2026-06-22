// amplifyConfig.js
import { Amplify } from "aws-amplify";
import amplifyOutputs from "./amplify_outputs.json";

// Configure Amplify with your backend outputs
Amplify.configure({
  Auth: {
    region: amplifyOutputs.auth.aws_region,
    userPoolId: amplifyOutputs.auth.user_pool_id,
    userPoolWebClientId: amplifyOutputs.auth.user_pool_client_id,
    identityPoolId: amplifyOutputs.auth.identity_pool_id,
  },
  API: {
    aws_appsync_graphqlEndpoint: amplifyOutputs.data.url,
    aws_appsync_region: amplifyOutputs.data.aws_region,
    aws_appsync_authenticationType: amplifyOutputs.data.default_authorization_type,
  },
});
