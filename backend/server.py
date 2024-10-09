from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from gtts import gTTS
import os
import base64

app = Flask(__name__, static_folder='frontend/dist')
CORS(app, resources={r"/mp3/*": {"origins": "http://localhost:5173"}})

@app.route('/mp3/<text>', methods=['GET'])
def get_mp3(text):
    try:
        announcement_text = f'Seuraavana: {text}'

        tts = gTTS(text=announcement_text, lang='fi')
        tts.save("announcement.mp3")
        with open("announcement.mp3", "rb") as audio_file:
            encoded_string = base64.b64encode(audio_file.read()).decode('utf-8')
        os.remove("announcement.mp3")

        return jsonify({'mp3': encoded_string})
    except Exception as e:
        print(e)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':

    app.run(port=8080)