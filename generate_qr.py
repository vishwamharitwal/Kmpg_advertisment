import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

def generate_permanent_qr(url: str, output_filename: str):
    """
    Generates a 100% permanent, static QR code that never expires.
    The URL is directly encoded into the QR matrix.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error tolerance (up to 30%)
        box_size=15,  # High resolution for crisp printing
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    img.save(output_filename)
    print(f"QR Code saved: '{output_filename}' -> {url}")
    return img

def generate_print_standee(qr_url: str, output_filename: str):
    """
    Generates a ready-to-print high-resolution counter standee card
    for K.M. Advertising & Publicity Services.
    """
    # Card canvas: 1200 x 1600 (3:4 ratio, high DPI)
    width, height = 1200, 1600
    card = Image.new("RGB", (width, height), color="#FFFFFF")
    draw = ImageDraw.Draw(card)

    # Decorative header background (Soft sky blue header)
    draw.rectangle([(0, 0), (width, 260)], fill="#F1F5F8")
    draw.line([(0, 260), (width, 260)], fill="#D5E4F4", width=4)

    # Paste Logo if exists
    if os.path.exists("image.png"):
        try:
            logo = Image.open("image.png").convert("RGBA")
            logo_w = 600
            logo_h = int(logo.height * (logo_w / logo.width))
            logo_resized = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
            card.paste(logo_resized, ((width - logo_w) // 2, 60), mask=logo_resized.split()[3])
        except Exception as e:
            print("Logo placement error:", e)

    # Subtitle / Service bar
    try:
        font_sub = ImageFont.truetype("arial.ttf", 36)
        font_title = ImageFont.truetype("arialbd.ttf", 64)
        font_instr = ImageFont.truetype("arial.ttf", 34)
        font_footer = ImageFont.truetype("arialbd.ttf", 38)
    except:
        font_sub = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_instr = ImageFont.load_default()
        font_footer = ImageFont.load_default()

    draw.text((width // 2, 290), "Corporate Gifting • Business Cards • Printing & Advertising", fill="#5A7184", font=font_sub, anchor="mm")
    
    # Call to action
    draw.text((width // 2, 380), "RATE YOUR EXPERIENCE", fill="#0F2027", font=font_title, anchor="mm")
    
    # 5 Gold Stars text representation
    draw.text((width // 2, 450), "★ ★ ★ ★ ★", fill="#F59E0B", font=ImageFont.truetype("arial.ttf", 55) if os.path.exists("C:/Windows/Fonts/arial.ttf") else font_title, anchor="mm")

    # Generate QR Code (700 x 700 px)
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=18,
        border=3,
    )
    qr.add_data(qr_url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#0F2027", back_color="#FFFFFF").convert("RGB")
    qr_img = qr_img.resize((680, 680), Image.Resampling.LANCZOS)

    # Frame border for QR
    qr_x = (width - 680) // 2
    qr_y = 530
    draw.rounded_rectangle([(qr_x - 16, qr_y - 16), (qr_x + 680 + 16, qr_y + 680 + 16)], radius=24, outline="#D5E4F4", width=4)
    card.paste(qr_img, (qr_x, qr_y))

    # Instructions below QR
    draw.text((width // 2, 1280), "Scan with your phone camera to leave a review", fill="#0F2027", font=font_instr, anchor="mm")
    draw.text((width // 2, 1335), "Takes less than 30 seconds • Quick & Easy", fill="#5A7184", font=font_sub, anchor="mm")

    # Bottom Banner
    draw.rectangle([(0, 1440), (width, height)], fill="#0F2027")
    draw.text((width // 2, 1520), "THANK YOU FOR YOUR SUPPORT!", fill="#FFFFFF", font=font_footer, anchor="mm")

    card.save(output_filename, quality=95)
    print(f"High-Res Print Standee saved: '{output_filename}'")

if __name__ == "__main__":
    # 1. Review System Web App URL (With smart filters & curated comments)
    web_url = "https://vishwamharitwal.github.io/Kmpg_advertisment/"
    generate_permanent_qr(web_url, "qr_code_review_system.png")

    # 2. Direct Google Review URL (Direct link to Google review box)
    google_url = "https://g.page/r/CfBwzW-LSEE0EBM/review"
    generate_permanent_qr(google_url, "qr_code_google_direct.png")

    # 3. Ready-to-print Standee / Counter Card
    generate_print_standee(web_url, "qr_standee_printable.png")
