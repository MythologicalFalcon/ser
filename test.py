import pprint
import google.generativeai as palm

palm.configure(api_key='AIzaSyB-a2U5Rwv2JVN7_6sq35ZGFug3EuUPfhE')
models = [m for m in palm.list_models() if 'generateText' in m.supported_generation_methods]
model = models[0].name
print(model)
