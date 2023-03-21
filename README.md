## Run
- `npm install`
- make `.env` file
- add/fill `COMMAND_PATH=` in `.env` file with path to your executable file/build of https://github.com/antimatter15/alpaca.cpp (e.g. `path-to-alpaca.cpp/Release/chat.exe`)
- add/fill `MODEL_PATH=` in `.env` file with path to your model file (e.g. `path-to-model/ggml-alpaca-7b-q4.bin`)
- `node index.js`
- open `localhost:3000` in your browser, and you will see message if model is loaded or not
- open `localhost:3000/chat?prompt=your_prompt` in your browser if model is loaded, and you will see response from model
- response will be `content-type: text/event-stream`