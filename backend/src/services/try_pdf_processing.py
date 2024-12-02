from ..services.pdf_processing_service import PDFProcessingService
import asyncio
import random
import json

async def main():
    service = PDFProcessingService()
    result = await service.process_pdf("C:/Users/aless/Desktop/Projects/greenreguai/backend/src/services/red_iii_2023.pdf")
    
    print(f"Total chunks: {len(result['chunks'])}\n")
    
    # Select 3 random chunks
    random_chunks = random.sample(result['chunks'], 3)
    
    for i, chunk in enumerate(random_chunks, 1):
        print(f"=== Random Chunk {i} ===")
        print(f"Content preview: {chunk.content[:]}")
        print(f"Page number: {chunk.page_number}")
        print(f"Section title: {chunk.section_title}")
        print(f"Location data:")
        print(json.dumps(chunk.location_data, indent=2))
        print(f"Element type: {chunk.element_type}")
        if chunk.font_info:
            print(f"Font info: {json.dumps(chunk.font_info, indent=2)}")
        print("\n")

if __name__ == "__main__":
    asyncio.run(main())