
# from fastapi import APIRouter
# import base64
# from io import BytesIO
# from apps.util import analyze_image
# from schema import ImageData
# from PIL import Image

# router = APIRouter()

# @router.post('')
# async def run(data: ImageData):
#     image_data = base64.b64decode(data.image.split(",")[1])  # Assumes data:image/png;base64,<data>
#     image_bytes = BytesIO(image_data)
#     image = Image.open(image_bytes)
#     responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
#     data = []
#     for response in responses:
#         data.append(response)
#     print('response in route: ', response)
#     return {"message": "Image processed", "data": data, "status": "success"}


from fastapi import APIRouter
import base64
from io import BytesIO
from apps.util import analyze_image
from schema import ImageData
from PIL import Image

router = APIRouter()

@router.post("")
async def run(data: ImageData):
    try:
        # Decode image data from base64
        image_data = base64.b64decode(data.image.split(",")[1])  # Assumes data:image/png;base64,<data>
        image_bytes = BytesIO(image_data)
        image = Image.open(image_bytes)

        # Analyze the image
        responses = analyze_image(image, dict_of_vars=data.dict_of_vars)

        # Collect responses
        result_data = []
        for response in responses:
            result_data.append(response)
        
        # Debugging output
        print('Responses in route:', responses)

        return {"message": "Image processed", "data": result_data, "status": "success"}
    
    except Exception as e:
        # Handle errors gracefully
        print("Error processing image:", str(e))
        return {"message": "Error processing image", "error": str(e), "status": "failure"}
