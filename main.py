import random
from flask import Flask, render_template, jsonify

app = Flask(__name__)

sample = ["be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "even", "new", "want", "because", "any", "these", "give", "day", "most",  "us", "very", "here", "way", "where", "many", "such", "through", "down", "own", "just", "little", "much", "find", "need", "too", "become", "leave", "case", "woman", "man", "life", "child", "world", "school", "state", "family", "student", "group", "country", "problem", "hand", "part", "place", "show", "year", "work", "may", "might", "should", "call", "every", "under", "between", "never", "number", "often", "without", "move", "feel", "seem", "both", "before", "big", "high", "always", "around", "near", "add", "food", "keep", "start", "try", "while", "again", "against", "ask", "bring", "begin", "follow", "hold", "today", "though", "upon", "until", "few", "since", "include", "once", "power", "later", "change", "different", "home", "large", "person", "small", "stand", "learn", "why", "center", "member", "best", "common", "human", "lead", "light", "question", "reason", "side", "something", "voice", "whole", "young", "among", "ever", "less", "next", "certain", "usually", "together", "become", "often", "across", "already", "almost", "below", "continue", "develop", "during", "enough", "especially", "however", "instead", "nothing", "perhaps", "several", "sometimes", "toward", "upon", "within", "along", "believe", "beyond", "create", "explain", "happen", "include", "increase", "inside", "notice", "possible", "present", "receive", "reduce", "remain", "suggest", "support", "system", "toward", "travel", "various", "walk", "wide", "across", "behind", "below", "beside", "beyond", "during", "inside", "near", "outside", "under", "above", "against", "around", "before", "between", "by", "down", "from", "in", "into", "of", "on", "out", "over", "through", "to", "toward", "under", "up",]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_text', methods=['GET'])
def get_text_api():
    text = ''.join([random.choice(sample) + ' ' for i in range(12)])[:-1]
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True)