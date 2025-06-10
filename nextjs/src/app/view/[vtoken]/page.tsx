/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import ViewMessagePage from "@/components/pages/ViewMessage";
import { Provider } from '@/components/ui/provider';


interface RouteParams {
  params: Promise<{ vtoken: string }>;
}


export default async function Page({ params }: RouteParams) {
  const { vtoken } = await params;
  if(vtoken==='void') return (
    <Provider>
      The message has been burned. hehe…
    </Provider>
  );
  if(vtoken.length<5) return 'Wrong ViewToken';
  return (
    <Provider>
      <ViewMessagePage vtoken={vtoken} />
    </Provider>
  );
}
