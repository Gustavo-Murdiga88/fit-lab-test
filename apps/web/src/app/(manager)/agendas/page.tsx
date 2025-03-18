"use client";

import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Pagination } from "../components/pagination";
import { Cards } from "./components/cards";
import { NewAgenda } from "./components/new-agenda";

export default function ConsultPage() {
  return (
    <>
      <NewAgenda />
      <Cards />
      <Pagination />
    </>
  );
}
