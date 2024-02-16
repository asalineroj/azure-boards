import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";


export const CreateWorkItemFunction = DefineFunction({
  callback_id: "create_work_item_function",
  source_file: "functions/create_work_item.ts",
  title: "Create Work Item",
  input_parameters: {
    properties: {
      input_title: {
        type: Schema.types.string,
      },
      input_description: {
        type: Schema.types.string,
      },
      input_type: {
        type: Schema.types.string,
      }
    },
    required: ["input_value"],
  },
  /*output_parameters: {
    properties: {
      result: {
        type: Schema.types.string,
      },
    },
    required: ["result"],
  },*/
});

export default SlackFunction(CreateWorkItemFunction, async ({ inputs, env }) => {
    console.log("Slack function called");
    console.log(env);
    
    //Title, Description, Type
    const input_title = inputs.input_title;
	console.log(input_title);
	const input_description = inputs.input_description;
	console.log(input_description);
	const input_type = inputs.input_type;
	console.log(input_type);


    //Env variables, defined in .env locally or 
    //added to Slack deployed enviroment. cli command=> slack env add MY_ENV_VAR asdf1234
    const azureBoardPAT = env["AZURE_BOARD_PAT"];
	const organization = env["AZURE_BOARD_ORG"];
	const project = env["AZURE_BOARD_PROJECT"];

	const azureHeaders = new Headers({
		Authorization: `Basic ${btoa(`:${azureBoardPAT}`)}`,
  		"Content-Type": "application/json-patch+json",
	});

	const body = [
    	{ 
	        "op":"add",
	        "path":"/fields/System.Title",
	        "from": null,
	        "value": input_title
    	},
    	{ 
	        "op":"add",
	        "path":"/fields/System.Description",
	        "from": null,
	        "value": input_description
    	}
	];

	console.log("Calling Azure API");
	try {  	
	  	const responseAzure = await fetch(`https://dev.azure.com/${organization}/${project}/_apis/wit/workitems/$${input_type}?api-version=6.0`, {
	    	method: 'POST',
	    	headers: azureHeaders,
	    	body: JSON.stringify(body),
	  	});

	  	var responseBody = await responseAzure.json();
	  	console.log("RESPONSE Azure");
	    console.log(responseBody.fields);
	  	console.log("Finished Calling Azure");
	} catch (error) {
		console.log(error);
	}

	return { outputs: {} };
});