import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import wasteClassification

from pydantic import BaseModel

from PIL import Image
import io
import sys
import logging

origins = ["*"]

app = FastAPI()
model = wasteClassification()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageModel(BaseModel):
    uri: str
    type: str
    name: str

@app.get("/ping")
def pong():
    return {"ping":"pong"}

@app.post("/predict", status_code=200)
async def predict(formData: UploadFile = File(...)):    
    
    if formData.content_type.startswith('image/') is False:
        raise HTTPException(status_code=400, detail=f'File \'{image.filename}\' is not an image.')    

    
    
    try:
        contents = await formData.read()
        pil_image = Image.open(io.BytesIO(contents)).convert('RGB')

        predicted_class = model.predictWaste(pil_image)
        
        
        logging.info(f"Predicted Class: {predicted_class}")
        return {        
           "class": predicted_class,
        }
    except Exception as error:
        print("errorrrr")
        logging.exception(error)
        e = sys.exc_info()[1]
        raise HTTPException(status_code=500, detail=str(e))

