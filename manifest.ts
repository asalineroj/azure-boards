import { Manifest } from "deno-slack-sdk/mod.ts";

//adding created function to manifest
import { CreateWorkItemFunction } from "./functions/create_work_item.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "azure-boards",
  description: "Build Slack apps with Deno to connect with Azure Boards",
  icon: "assets/default_new_app_icon.png",
  functions: [CreateWorkItemFunction],
  workflows: [],
  outgoingDomains: ["dev.azure.com"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
