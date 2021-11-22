from flask import Flask, request, jsonify
# # from gramformer import Gramformer
from happytransformer import HappyGeneration, GENSettings
# # import torch

app = Flask(__name__)

# # for reproducibility
# def set_seed(seed):
#     torch.manual_seed(seed)
#     if torch.cuda.is_available():
#         torch.cuda.manual_seed_all(seed)

# set_seed(42069)

# gf = Gramformer(models=1, use_gpu=False)
# def correct_grammar(source_sentence):
#     valid_candidates = gf.correct(source_sentence, max_candidates=5)
#     candidates = [c[0] for c in valid_candidates]
#     return candidates

neo = HappyGeneration("GPT-NEO", "EleutherAI/gpt-neo-125M")
# top-k decoding w/o repetitions
# https://happytransformer.com/text-generation/settings/
args1 = GENSettings(top_k=50,
                    do_sample=True,
                    temperature=0.8,
                    early_stopping=True,
                    max_length=14,
                    no_repeat_ngram_size=2)
args2 = GENSettings(num_beams=5,
                    do_sample=False,
                    temperature=0.9,
                    early_stopping=True,
                    max_length=14,
                    no_repeat_ngram_size=3)
args3 = GENSettings(top_p=0.8,
                    do_sample=True,
                    temperature=0.95,
                    early_stopping=True,
                    max_length=14,
                    no_repeat_ngram_size=2)


def generate_suggestion(source_sentence, args):
    source_sentence += " "
    suggestion = neo.generate_text(source_sentence, args=args)
    suggestion = ' '.join(suggestion.text.split())
    return suggestion


@app.route('/', methods=['GET'])
def main_route():
    return "Success", 200


@app.route('/predict', methods=['POST'])
def driver():
    source_sentence = request.json["data"]
    targets = []
    for args in [args1, args2, args3]:
        targets.append(generate_suggestion(source_sentence, args))
    return jsonify(targets), 200


if __name__ == '__main__':
    app.run(debug=True, port=8080)
