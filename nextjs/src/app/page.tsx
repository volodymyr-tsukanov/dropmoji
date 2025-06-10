/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import HomePage from "@/components/pages/Home";
import { Provider } from "@/components/ui/provider";


export default async function Home() {
  return (
    <Provider><HomePage /></Provider>
  );
}
