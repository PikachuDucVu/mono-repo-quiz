import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { LobbyScreen } from "./screen/LobbyScreen";
import { PlayerGameScreen } from "./screen/PlayerGameScreen/PlayerGameScreen";
import { RegisterScreen } from "./screen/RegisterScreen";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-black text-white flex justify-center items-center">
      <div className="w-full max-w-lg h-full rounded-xl">{children}</div>
    </div>
  );
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Switch>
          <Route path="/lobby/:gameId" component={LobbyScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/register/:gameId" component={RegisterScreen} />
          <Route path="/game/:gameId" component={PlayerGameScreen} />
        </Switch>
      </MainLayout>
    </QueryClientProvider>
  );
}

export default App;
