import Image from "next/image";
import {
  Header,
  PhilosophySection,
  StatsSection,
  SkillsSection,
  ContactSection,
  Footer,
} from '@/components';

import type { NextPage } from 'next';
import { useEffect, useState } from "react";
import Testimonials from "@/components/Testimonial";
import RentalInventory from "@/components/RentalInventory";
import HeroImage from "@/components/HeroImage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs );

const client = generateClient<Schema>();

const Home: NextPage = () => {
  // const { signOut } = useAuthenticator();
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // function listTodos() {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }

  // useEffect(() => {
  //   listTodos();
  // }, []);

  // function createTodo() {
  //   client.models.Todo.create({
  //     content: window.prompt("Todo content"),
  //   });
  // }

  return (
    <>
      <Header/>
      <HeroImage/>
      <PhilosophySection/>
        <StatsSection/>
        <SkillsSection/>
        <ContactSection/>
        <Footer/>
        </>
    
  );
}
export default Home;
