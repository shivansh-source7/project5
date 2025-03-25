from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import base64
import io
from PIL import Image
import numpy as np
import cv2
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import torch
from python-pptx import Presentation
from python-pptx.util import Inches

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten')

class ImageRequest(BaseModel):
    image: str  # Base64 encoded image

class DiagramData(BaseModel):
    type: str
    svgContent: str

class ExtractedContent(BaseModel):
    text: List[str]
    equations: List[str]
    diagrams: List[DiagramData]

def preprocess_image(image_data: str) -> Image.Image:
    """Preprocess the input image."""
    try:
        # Remove data URL prefix if present
        if 'base64,' in image_data:
            image_data = image_data.split('base64,')[1]
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

def extract_text(image: Image.Image) -> List[str]:
    """Extract text from image using TrOCR."""
    try:
        # Prepare image for model
        pixel_values = processor(image, return_tensors="pt").pixel_values
        
        # Generate text
        generated_ids = model.generate(pixel_values)
        generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)
        
        return generated_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

@app.post("/extract", response_model=ExtractedContent)
async def extract_content(request: ImageRequest):
    """Extract content from whiteboard image."""
    try:
        # Preprocess image
        image = preprocess_image(request.image)
        
        # Extract text
        extracted_text = extract_text(image)
        
        # For now, return dummy data for equations and diagrams
        # In a production environment, you would implement proper detection
        return ExtractedContent(
            text=extracted_text,
            equations=["E = mc^2"],  # Placeholder
            diagrams=[
                DiagramData(
                    type="flowchart",
                    svgContent="<svg>...</svg>"  # Placeholder
                )
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-slides")
async def generate_slides(content: ExtractedContent):
    """Generate PowerPoint slides from extracted content."""
    try:
        prs = Presentation()
        
        # Title slide
        title_slide = prs.slides.add_slide(prs.slide_layouts[0])
        title_slide.shapes.title.text = "Whiteboard Content"
        
        # Content slides
        for text in content.text:
            content_slide = prs.slides.add_slide(prs.slide_layouts[1])
            content_slide.shapes.title.text = "Extracted Text"
            content_slide.shapes.placeholders[1].text = text
        
        # Save presentation
        output = io.BytesIO()
        prs.save(output)
        output.seek(0)
        
        return output.getvalue()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate slides: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)