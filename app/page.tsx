"use client";

import { useState, useEffect } from "react";
import {
  Header,
  HeroCarousel,
  PhilosophySection,
  StatsSection,
  SkillsSection,
  ContactSection,
  Footer,
} from '@/components';

import type { NextPage } from 'next';
import AquaticCarousel from "@/components/AquaticCarousel";
import Testimonials from "@/components/Testimonial";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main>
      <Header/> 
          {/* <HeroCarousel/>    */}
          <AquaticCarousel/>
          <PhilosophySection/>
          <StatsSection/>
          <Testimonials />
          <SkillsSection/>
          <ContactSection/>
          <Footer/>
            <button onClick={signOut}>Sign out</button>
    </main>
  );
}
