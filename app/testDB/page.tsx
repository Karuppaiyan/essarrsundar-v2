
import { Header, Footer } from '@/components';
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";


Amplify.configure(outputs );

const client = generateClient<Schema>();

// Amplify.configure({
//   API: {
//     GraphQL: {
//       endpoint: 'https://h3c5n4d25zfhbeifslbhsin5n4.appsync-api.ap-south-1.amazonaws.com/graphql',
//       region: 'ap-south-1',
//       defaultAuthMode: 'userPool',
//     }
//   }
// });

const testDB = async () => {
  const { data: products } = await client.models.Product.list();

  return (
    <>
      <h1>Test DB</h1>
      <ul>{products?.map((product: any) => <li key={product.id}>{product.name}</li>)}</ul>
      <br/><br/><br/>
    </>
  );
};

export default testDB;
