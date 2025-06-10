/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import CreateMessagePage from "@/components/pages/CreateMessage";
import ProtectedRoute from "@/components/Protected";
import { Provider } from '@/components/ui/provider';


export default async function Page() {
  return (
    <Provider>
      <ProtectedRoute>
        <CreateMessagePage />
      </ProtectedRoute>
    </Provider>
  )
}
