from flask import Flask, render_template, jsonify, request
import os
import chardet

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    content = request.json.get('content', '')
    filename = request.json.get('filename', 'untitled.txt')
    encoding = request.json.get('encoding', 'utf-8')
    
    # Encode the content with the specified encoding
    encoded_content = content.encode(encoding)
    
    return jsonify({
        'content': encoded_content.decode('utf-8'),  # Send as UTF-8 for JSON
        'filename': filename,
        'encoding': encoding
    })

@app.route('/detect_encoding', methods=['POST'])
def detect_encoding():
    file_content = request.json.get('content', '')
    result = chardet.detect(file_content.encode('utf-8'))
    return jsonify({'encoding': result['encoding']})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
