function myFunction() {
  // OpenAI API Key
  const key = ScriptProperties.getProperty("API_KEY");
  // 質問
  let base_prompt = "(大本の質問) 日本語で回答してください";
  // 類似データ取得
  const json = getJSONData();

  // 類似データ無しの質問と回答
  let prompt = base_prompt;
  let res = callOpenAI(key, prompt);
  Logger.log(res)

  // 類似データ（単独）の質問と回答
  prompt = getPrompt(base_prompt,json[0].question,json[0].answer)
  res = callOpenAI(key, prompt);
  Logger.log(res)

  // 類似データ（複数）の質問と回答
  prompt = generateChatGptPrompt(base_prompt,json);
  res = callOpenAI(key, prompt);
  Logger.log(res)

}

function getJSONData(){
  const json = [
    {
      question : "参照質問1",
      answer   : "参照回答1"
    },
    {
      question : "参照質問2",
      answer   : "参照回答2"
    },
    {
      question : "参照質問2",
      answer   : "参照回答3"
    },
  ];
  return json;
}

function getPrompt(userInput,question,answer){
  const chatGptPrompt = `User asked: "${userInput}"\nSimilar question found: "${question}"\nAnswer: "${answer}"`;
  return chatGptPrompt;
}

function generateChatGptPrompt(userInput, similarQuestionsAndAnswers) {
  let prompt = `User asked: "${userInput}"\n\n`;
  
  for (let i = 0; i < similarQuestionsAndAnswers.length; i++) {
    const question = similarQuestionsAndAnswers[i].question;
    const answer = similarQuestionsAndAnswers[i].answer;
    prompt += `Similar question ${i + 1}: "${question}"\nAnswer ${i + 1}: "${answer}"\n\n`;
  }

  prompt += 'Best answer for the user:';
  return prompt;
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
  const resJson = JSON.parse(res.getContentText());
  return resJson.choices[0].message.content
}
