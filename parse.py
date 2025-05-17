import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

file = open("prompt.txt", "r")

content = file.read()
print(content)
# Retrieve the API key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

print(openai.api_key)

# # Make a request to the OpenAI Chat API
# response = openai.ChatCompletion.create(
#     model="gpt-4",
#     messages=[
#         {"role": "system", "content": "You"},
#         {"role": "user", "content": "Explain the concept of reinforcement learning."}
#     ],
#     temperature=0.7,
#     max_tokens=150
# )

# Print the result
# print(response.choices[0].message['content'])
