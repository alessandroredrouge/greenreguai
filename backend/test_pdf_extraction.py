import asyncio
import logging
from src.services.pdf_processing_service import PDFProcessingService
from src.services.supabase import supabase_service
import tempfile
import os
from datetime import datetime
import fitz

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

async def test_pdf_extraction():
    # Document path in Supabase
    file_path = "regulations/europe/Recommendation and a guidance document on permit-granting processes and PPAs 2022.pdf"
    output_file = "pdf_processing_test_results.md"
    
    try:
        # Download file from Supabase to temp location
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        file_data = await supabase_service.download_file(file_path)
        temp_file.write(file_data)
        temp_file.flush()
        temp_file.close()
        
        # Initialize PDF processor
        pdf_processor = PDFProcessingService()
        
        print("Starting PDF processing test...")
        
        # Write results to markdown file
        with open(output_file, 'w', encoding='utf-8') as f:
            # Write header
            f.write(f"# PDF Processing Test Results\n\n")
            f.write(f"**Test run at:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Document:** {file_path}\n\n")
            
            # First, get and write the full text
            f.write("## Full Document Text\n\n")
            doc = fitz.open(temp_file.name)
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text("text")
                f.write(f"### Page {page_num + 1}\n\n")
                f.write("```text\n")
                f.write(text)
                f.write("\n```\n\n")
            doc.close()
            
            # Then process and write the chunks
            f.write("## Semantic Chunks\n\n")
            result = await pdf_processor.process_pdf(temp_file.name)
            for i, chunk in enumerate(result['chunks'], 1):
                f.write(f"### Chunk {i} (Page {chunk['page_number']})\n\n")
                f.write("```text\n")
                f.write(chunk['content'])
                f.write("\n```\n\n")
                f.write("**Metadata:**\n")
                f.write(f"- Section Title: {chunk['section_title']}\n")
                f.write(f"- Characters: {len(chunk['content'])}\n")
                f.write(f"- Words: {len(chunk['content'].split())}\n")
                f.write("---\n\n")
                
        print(f"Processing results saved to {output_file}")
        
    except Exception as e:
        print(f"Error in PDF processing test: {str(e)}")
        raise
        
    finally:
        # Cleanup
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)

if __name__ == "__main__":
    asyncio.run(test_pdf_extraction()) 