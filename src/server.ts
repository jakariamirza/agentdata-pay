import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(
    `AgentData Pay listening on ${config.baseUrl} (${config.paymentMode} payment mode)`,
  );
});
