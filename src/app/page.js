"use client"
import TopNavbar from "@/components/Nav/TopNavbar";
import "@/style/index.css";
import '@/style/flexboxgrid.min.css';
import Header from "@/components/Sections/Header";
import Services from "@/components/Sections/Services";
import Projects from "@/components/Sections/Projects";
import Blog from "@/components/Sections/Blog";
import Pricing from "@/components/Sections/Pricing";
import Footer from "@/components/Sections/Footer";
import Contact from "@/components/Sections/Contact";
import AOS from "aos";
import "aos/dist/aos.css";
import {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    AOS.init({duration: 1200});
  });
  return (
    <>
      <TopNavbar/>
      <Header/>
      <Services/>
      <Projects/>
      <Contact/>
      <Footer/>
    </>
  );
}
