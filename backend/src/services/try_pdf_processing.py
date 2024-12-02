from pdf_processing_service import PDFProcessingService
import asyncio

async def main():
    service = PDFProcessingService()
    result = await service.process_pdf("../../tests/test_files/red_iii_2023.pdf")
    print("Chunks:", len(result['chunks']))
    print("First chunk content:", result['chunks'][0].content[:100])
    print("TOC:", result['toc'])

if __name__ == "__main__":
    asyncio.run(main())