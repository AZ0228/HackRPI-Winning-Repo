import openai
import os
import datetime
# from dotenv import load_dotenv

# # Load the .env file
# load_dotenv()

# Replace 'your-api-key' with your actual OpenAI API key
openai.api_key = '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'

def get_response(country_name):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Use the latest model optimized for chat
        messages=[
            {"role": "system", "content": "You are a knowledgeable assistant who provides very concise information on countries' climate history, focusing on emissions data. Avoid specific statistics"},
            {"role": "user", "content": f"What is the climate history of {country_name} with an emphasis on its greenhouse gas emissions?"}
        ]
    )
    return response['choices'][0]['message']['content']

prompt = "United States"
now = datetime.datetime.now()
response_text = get_response(prompt)
print(datetime.datetime.now() - now)
print(response_text)