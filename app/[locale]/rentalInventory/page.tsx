import type { NextPage } from 'next';
import { Header, Footer } from '@/components';
import RentalInventory from '@/components/RentalInventory';

const res = await client.models.Product.list({ authMode: 'apiKey' });

const RentalInventoryPage: NextPage = () => {
  return (
    <>
      <RentalInventory />
    </>
  );
};

export default RentalInventoryPage;
