import { useState } from "react";
import { Route, Switch } from "wouter";
import { Lobby } from "./component/lobby/Lobby";
import { SetUpAdmin } from "./component/setup/SetUpAdmin";
import { SetUpPrompt } from "./component/setup/SetUpPrompt";
import { LoadingProvider } from "./context/Loading";

function App() {
  const [setUp, setSetUp] = useState<boolean>(
    localStorage.getItem("token") !== null
  );

  if (!setUp) {
    return (
      <SetUpPrompt
        onSetup={(token) => {
          localStorage.setItem("token", token);
          setSetUp(token !== null);
        }}
      />
    );
  }

  return (
    <Switch>
      <LoadingProvider>
        <Route path="/" component={Lobby} />
      </LoadingProvider>
    </Switch>
  );
}

const MainLayout = () => {
  return (
    <div className="w-full h-full bg-gray-800 text-white flex justify-center items-center overflow-auto">
      <div className="w-full max-w-[1080px] aspect-video bg-gray-900 rounded-xl">
        <App />
      </div>
    </div>
  );
};

const OutmostRouter = () => {
  return (
    <Switch>
      <Route path="/setup/:id" component={SetUpAdmin} />
      <Route component={MainLayout} />
    </Switch>
  );
};

export default OutmostRouter;
