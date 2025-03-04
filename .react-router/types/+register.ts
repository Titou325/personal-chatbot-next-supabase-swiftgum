import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/api/webhook": {};
  "/api/chat": {};
  "/register": {};
  "/login": {};
  "/chat/:id": {
    "id": string;
  };
};