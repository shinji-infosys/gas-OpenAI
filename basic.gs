function myFunction() {
  const key = ScriptProperties.getProperty("API_KEY");
  const prompt = "こんにちは！";

  const res = callOpenAI(key, prompt);
  Logger.log(res)
}

function callOpenAI(OPENAI_API_KEY,Message) {
  const headers = {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        };

  const messages = [{
          role: "user",
          content: Message,
        }]

  const payload = JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
        })

  const url = "https://api.openai.com/v1/chat/completions";

  const options = {
          "method": "post",
          "headers": headers,
          "payload": payload,
        };
  const res = UrlFetchApp.fetch(url, options);
  return JSON.parse(res.getContentText());
}
