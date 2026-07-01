import type { NextPage } from 'next';
import { Header, Footer } from '@/components';
import RentalInventory from '@/components/RentalInventory';

const RentalInventoryPage: NextPage = () => {
  return (
    <>
      <Header />
      <RentalInventory />
      <Footer />
    </>
  );
};

export default RentalInventoryPage;
