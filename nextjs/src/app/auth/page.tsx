/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import AuthPage from "@/components/pages/Auth";
import { Provider } from '@/components/ui/provider';


export default async function Page() {
  return (
    <Provider>
      <AuthPage />
    </Provider>
  );
}
