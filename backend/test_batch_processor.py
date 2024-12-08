import asyncio
from src.services.pdf_batch_processor import pdf_batch_processor

async def main():
    try:
        await pdf_batch_processor.process_all_unprocessed()
        print("Batch processing completed successfully!")
    except Exception as e:
        print(f"Error in batch processing: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main()) 