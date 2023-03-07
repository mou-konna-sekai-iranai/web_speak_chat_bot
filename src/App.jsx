import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [response, setResponse] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  const [displayState, setDisplayState] = useState(
    "ボタンを押してマイクで話しかけてみてください"
  );

  const configuration = new Configuration({
    organization: "org-dVR4vhns2gBuoVlrs3OjOCFa",
    apiKey: "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",
  });

  const AITextSubmit = async () => {
    setDisplayState("AIの応答を待っています...");

    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "日本語でアニメの美少女のように可愛く返答して。ただし語尾は「のだ。」、「なのだ。」をつけて。一人称は僕",
        },
        { role: "user", content: recognizedText },
      ],
    });

    const ai_response = completion.data.choices[0].message;
    setResponse(ai_response.content);
    console.log(ai_response);
    setDisplayState("AIの応答を取得しました");
  };

  const handleStartListening = async () => {
    setIsListening(true);
    setDisplayState("音声の入力を受け付けています...。");

    const recognition = new window.webkitSpeechRecognition();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(transcript);
      setRecognizedText(transcript);

      setIsListening(false);
      setDisplayState("音声の入力を受け付けています...。");
    };

    recognition.start();
  };

  const handleZundamon = async () => {
    setDisplayState("ずんだもんが文章を読んでいます。");
    const url =
      "https://api.su-shiki.com/v2/voicevox/audio/?key=p-1784X3v0y3Q86&speaker=0&pitch=0&intonationScale=1&speed=1";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: "読み上げる文" }),
    });

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const videoElement = doc.getElementsByTagName("video")[0];
    if (videoElement) setVideoSrc(videoElement);
    setDisplayState("ありがとうずんだもん");
  };

  const handleInputChange = (event) => {
    setRecognizedText(() => event.target.value);
  };

  return (
    <>
      <p>{displayState}</p>
      <div>
        <button onClick={handleStartListening}>
          {isListening ? "音声認識中..." : "音声認識開始"}
        </button>
        <input
          type="text"
          value={recognizedText}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={AITextSubmit}>AIに文章を送る</button>
      <p>{response}</p>
      <button onClick={handleZundamon}>ずんだもんに読ませる(工事中)</button>
      <p>{videoSrc}</p>
    </>
  );
}

export default App;
