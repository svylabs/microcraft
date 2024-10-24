import PyPDF2
import sys

def encrypt_pdf(input_pdf_path, output_pdf_path, password):
    try:
        with open(input_pdf_path, 'rb') as input_file:
            pdf_reader = PyPDF2.PdfReader(input_file)
            pdf_writer = PyPDF2.PdfWriter()

            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                pdf_writer.add_page(page)

            pdf_writer.encrypt(user_password=password, owner_pwd=None, use_128bit=True)

            with open(output_pdf_path, "wb") as output_file:
                pdf_writer.write(output_file)

        print("PDF encrypted successfully")

    except Exception as e:
            print("Failed to encrypt")
        
if __name__ == "__main__":
    input_pdf_path = sys.argv[1]
    output_pdf_path = sys.argv[2]
    password = sys.argv[3]

    encrypt_pdf(input_pdf_path, output_pdf_path, password)

