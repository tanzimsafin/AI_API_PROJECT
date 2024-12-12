import fetch from "node-fetch"; // Only needed for Node.js, not needed in the browser

const url = "https://api.edenai.run/v2/workflow/dfa7a567-e135-44cf-900a-4bb01d8efe9f/execution/";
const payload = {"prompt":`Give me some name of bangladeshi foods`};

const launchExecution = async () => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTE4ZDQ1NDItNTZhYS00OTkzLTkyMDUtZGYzZTEwMWFkMTI3IiwidHlwZSI6ImFwaV90b2tlbiJ9.NUwWh8vlTYp4mO6q3pKwcguXB1rlgqt_5nrkhs77UZk"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  return result;
};

const getExecutionResult = async (executionId) => {
  const resultUrl = `${url}${executionId}/`;
  let status = "processing";
  let result;

  while (status === "processing") {
    const response = await fetch(resultUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTE4ZDQ1NDItNTZhYS00OTkzLTkyMDUtZGYzZTEwMWFkMTI3IiwidHlwZSI6ImFwaV90b2tlbiJ9.NUwWh8vlTYp4mO6q3pKwcguXB1rlgqt_5nrkhs77UZk"
      }
    });
    result = await response.json();
    status = result.content.status;
    if (status === "processing") {
      await new Promise(resolve => setTimeout(resolve, 2000)); // wait for 2 seconds before polling again
    }
  }

  return result;
};

const main = async () => {
  const execution = await launchExecution();
  const data = await getExecutionResult(execution.id);
  console.log(payload);
  console.log(`Generated Text: ${data.content.results.text__chat.results[0].generated_text}`);
};

main();