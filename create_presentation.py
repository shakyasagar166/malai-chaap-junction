import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Premium Color Palette
    BG_DARK = RGBColor(11, 15, 25)         # Deep Midnight Obsidian #0B0F19
    CARD_BG = RGBColor(21, 29, 44)         # Slate 900 Surface #151D2C
    CARD_HEADER_BG = RGBColor(28, 39, 58)  # Slate 800 Tint #1C273A
    BORDER_DEFAULT = RGBColor(40, 53, 76)  # Subtle Slate Border #28354C
    
    # Accent Colors
    GOLD = RGBColor(245, 158, 11)          # Amber 500 #F59E0B
    AMBER = GOLD
    GOLD_LIGHT = RGBColor(252, 211, 77)    # Amber 300 #FCD34D
    ORANGE = RGBColor(234, 88, 12)         # Orange 600 #EA580C
    EMERALD = RGBColor(16, 185, 129)       # Emerald 500 #10B981
    EMERALD_BG = RGBColor(15, 45, 35)      # Deep Emerald Tint
    RED = RGBColor(239, 68, 68)            # Rose 500 #EF4444
    RED_BG = RGBColor(45, 20, 25)          # Deep Crimson Tint
    BLUE = RGBColor(56, 189, 248)          # Sky 400 #38BDF8
    PURPLE = RGBColor(168, 85, 247)        # Purple 500 #A855F7
    
    # Text Colors
    WHITE = RGBColor(255, 255, 255)
    GRAY_LIGHT = RGBColor(226, 232, 240)   # Slate 200
    GRAY_MUTED = RGBColor(148, 163, 184)   # Slate 400
    GRAY_DARK = RGBColor(100, 116, 139)    # Slate 500

    # Screenshot paths if available
    img_admin = 'C:/Users/Asus/.gemini/antigravity/brain/b64db881-0415-4ba8-b4cf-37f7a337d7c9/.user_uploaded/media_1792324255327_e2270b34.png'
    img_verify = 'C:/Users/Asus/.gemini/antigravity/brain/b64db881-0415-4ba8-b4cf-37f7a337d7c9/.user_uploaded/media_1792334591444_f47256b0.png'

    def apply_base_decorations(slide, slide_num, total_slides=10):
        # 1. Slide Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()

        # 2. Top Glowing Gradient Accent Bar
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.08))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = GOLD
        top_bar.line.fill.background()

        # 3. Bottom Footer Separator Line
        foot_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.02))
        foot_line.fill.solid()
        foot_line.fill.fore_color.rgb = BORDER_DEFAULT
        foot_line.line.fill.background()

        # 4. Footer Left: Brand & Location
        f_left = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(5.5), Inches(0.35))
        tf_fl = f_left.text_frame
        tf_fl.word_wrap = True
        p_fl = tf_fl.paragraphs[0]
        p_fl.text = "SVAD MALAI CHAAP JUNCTION • SANJAY NAGAR, GHAZIABAD"
        p_fl.font.size = Pt(8.5)
        p_fl.font.bold = True
        p_fl.font.color.rgb = GRAY_MUTED

        # 5. Footer Center: Platform Tag
        f_center = slide.shapes.add_textbox(Inches(5.5), Inches(7.08), Inches(4.5), Inches(0.35))
        tf_fc = f_center.text_frame
        tf_fc.word_wrap = True
        p_fc = tf_fc.paragraphs[0]
        p_fc.text = "Next-Gen QR Ordering & Smart Kitchen Management Platform"
        p_fc.font.size = Pt(8.5)
        p_fc.font.color.rgb = GRAY_DARK

        # 6. Footer Right: Slide Number Badge
        f_badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.6), Inches(7.08), Inches(0.93), Inches(0.28))
        f_badge.fill.solid()
        f_badge.fill.fore_color.rgb = CARD_HEADER_BG
        f_badge.line.color.rgb = BORDER_DEFAULT
        f_badge.line.width = Pt(1)
        tf_fb = f_badge.text_frame
        p_fb = tf_fb.paragraphs[0]
        p_fb.alignment = PP_ALIGN.CENTER
        p_fb.text = f"{slide_num:02d} / {total_slides:02d}"
        p_fb.font.size = Pt(8.5)
        p_fb.font.bold = True
        p_fb.font.color.rgb = GOLD

    def add_slide_header(slide, title, category, subtitle=None, badge=None, badge_color=EMERALD):
        # Category Tag Pill
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.32), Inches(8.5), Inches(0.3))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = f"●  {category.upper()}"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = GOLD

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.62), Inches(8.8), Inches(0.6))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE

        # Subtitle
        if subtitle:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.15), Inches(9.2), Inches(0.45))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            p_sub = tf_sub.paragraphs[0]
            p_sub.text = subtitle
            p_sub.font.size = Pt(11.5)
            p_sub.font.color.rgb = GRAY_MUTED

        # Optional Top-Right Status Badge
        if badge:
            badge_shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.8), Inches(0.45), Inches(2.73), Inches(0.45))
            badge_shape.fill.solid()
            badge_shape.fill.fore_color.rgb = CARD_BG
            badge_shape.line.color.rgb = badge_color
            badge_shape.line.width = Pt(1.5)
            tf_b = badge_shape.text_frame
            p_b = tf_b.paragraphs[0]
            p_b.alignment = PP_ALIGN.CENTER
            p_b.text = badge
            p_b.font.size = Pt(10)
            p_b.font.bold = True
            p_b.font.color.rgb = badge_color

        # Subtle Header Divider
        div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.733), Inches(0.015))
        div.fill.solid()
        div.fill.fore_color.rgb = BORDER_DEFAULT
        div.line.fill.background()

    def add_styled_card(slide, left, top, width, height, title, points, accent_color=GOLD, tag=None, bg_tint=None):
        # Outer Card
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_tint if bg_tint else CARD_BG
        card.line.color.rgb = accent_color
        card.line.width = Pt(1.5)

        # Card Header Band
        band = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.05), Inches(top + 0.05), Inches(width - 0.1), Inches(0.55))
        band.fill.solid()
        band.fill.fore_color.rgb = CARD_HEADER_BG
        band.line.fill.background()

        # Header Title
        h_box = slide.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.12), Inches(width - 0.4), Inches(0.45))
        tf_h = h_box.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = accent_color

        # Tag Badge in Header (Right aligned inside header band if present)
        if tag:
            tag_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + width - 1.45), Inches(top + 0.14), Inches(1.3), Inches(0.32))
            tag_box.fill.solid()
            tag_box.fill.fore_color.rgb = CARD_BG
            tag_box.line.color.rgb = accent_color
            tag_box.line.width = Pt(1)
            tf_t = tag_box.text_frame
            p_t = tf_t.paragraphs[0]
            p_t.alignment = PP_ALIGN.CENTER
            p_t.text = tag
            p_t.font.size = Pt(8.5)
            p_t.font.bold = True
            p_t.font.color.rgb = accent_color

        # Content Text Box
        c_box = slide.shapes.add_textbox(Inches(left + 0.22), Inches(top + 0.68), Inches(width - 0.44), Inches(height - 0.75))
        tf_c = c_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0)
        tf_c.margin_right = Inches(0)
        tf_c.margin_top = Inches(0)

        for i, pt in enumerate(points):
            p = tf_c.paragraphs[0] if i == 0 else tf_c.add_paragraph()
            # Split point into title and detail if colon exists
            if ":" in pt:
                head, detail = pt.split(":", 1)
                run1 = p.add_run()
                run1.text = f"✔ {head.strip()}: "
                run1.font.bold = True
                run1.font.size = Pt(11)
                run1.font.color.rgb = WHITE
                
                run2 = p.add_run()
                run2.text = detail.strip()
                run2.font.size = Pt(11)
                run2.font.color.rgb = GRAY_LIGHT
            else:
                run = p.add_run()
                run.text = f"• {pt}"
                run.font.size = Pt(11)
                run.font.color.rgb = GRAY_LIGHT
            
            p.space_after = Pt(7)

    def add_kpi_stat_card(slide, left, top, width, height, value, label, subtext, color=GOLD):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tx = slide.shapes.add_textbox(Inches(left + 0.15), Inches(top + 0.12), Inches(width - 0.3), Inches(height - 0.25))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0)
        tf.margin_top = Inches(0)

        p1 = tf.paragraphs[0]
        p1.text = value
        p1.font.size = Pt(32)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = label.upper()
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = WHITE
        p2.space_before = Pt(3)

        p3 = tf.add_paragraph()
        p3.text = subtext
        p3.font.size = Pt(9.5)
        p3.font.color.rgb = GRAY_MUTED
        p3.space_before = Pt(3)

    # =============================================================
    # SLIDE 1: Premium Title Slide (Hero Deck)
    # =============================================================
    s1 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s1, 1)

    # Decorative Hero Aura Pill
    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.9), Inches(4.3), Inches(0.42))
    pill.fill.solid()
    pill.fill.fore_color.rgb = CARD_HEADER_BG
    pill.line.color.rgb = GOLD
    pill.line.width = Pt(1.2)
    tf_pill = pill.text_frame
    p_pill = tf_pill.paragraphs[0]
    p_pill.text = "👑  100% PURE VEG FAST-CASUAL QSR PLATFORM"
    p_pill.font.size = Pt(9.5)
    p_pill.font.bold = True
    p_pill.font.color.rgb = GOLD_LIGHT

    # Main Presentation Title
    h_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(11.7), Inches(2.2))
    tf1 = h_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "SVAD MALAI CHAAP JUNCTION"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = WHITE

    p2 = tf1.add_paragraph()
    p2.text = "Smart QR Ordering, Kitchen Automation & Live Daily Sales Platform"
    p2.font.size = Pt(19)
    p2.font.bold = True
    p2.font.color.rgb = GOLD
    p2.space_before = Pt(6)

    p3 = tf1.add_paragraph()
    p3.text = "A complete modern digital dining engine designed for maximum table turnover, zero waiter errors & high profitability."
    p3.font.size = Pt(12.5)
    p3.font.color.rgb = GRAY_LIGHT
    p3.space_before = Pt(6)

    # Location & Tech Metadata Pill
    meta = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.6), Inches(11.733), Inches(0.45))
    meta.fill.solid()
    meta.fill.fore_color.rgb = CARD_HEADER_BG
    meta.line.color.rgb = BORDER_DEFAULT
    tf_m = meta.text_frame
    p_m = tf_m.paragraphs[0]
    p_m.text = "📍 Location: L-127, Sanjay Nagar, Sector - 23, Ghaziabad   •   ⚡ Live URLs: malai-chaap-junction.vercel.app   •   🚀 2026 Production Edition"
    p_m.font.size = Pt(10)
    p_m.font.bold = True
    p_m.font.color.rgb = GRAY_LIGHT

    # 3 Hero Pillars
    add_styled_card(s1, 0.8, 4.3, 3.65, 2.5, "📱 1-Scan QR Ordering", [
        "30-Second Ordering: Grahak table par baithe-baithe camera se scan karke turant order karta hai.",
        "Zero Waiter Dependency: Peak rush me waiter ko awaz lagane ki zaroorat nahi.",
        "Zero App Download: Phone me koi heavy app install nahi karni padti."
    ], GOLD, tag="SPEED")

    add_styled_card(s1, 4.84, 4.3, 3.65, 2.5, "🛡️ 2-Step Seat Verification", [
        "Anti-Fraud Gating: Pehle staff verify karta hai ki customer seat par baitha hai ya nahi.",
        "Zero Remote Wastage: Ghr baithe fake orders tandoor me banne se pehle hi reject ho jate hain.",
        "Complete Service: Khana serve hone ke baad hi 'Order Complete' hota hai."
    ], EMERALD, tag="SECURITY")

    add_styled_card(s1, 8.88, 4.3, 3.65, 2.5, "📊 Live 'Aaj Ka Hisab'", [
        "Live Revenue Counter: Din bhar ki collection ka live counter bina register jode ready.",
        "Tarikh-Wise Reports: Kisi bhi puraani date ka complete sales hisab 1-click me.",
        "Bestselling Ranking: Malai Chaap, Afghani Tikka, Rolls ki item-wise sale."
    ], ORANGE, tag="ANALYTICS")

    # =============================================================
    # SLIDE 2: Problem vs Solution
    # =============================================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s2, 2)
    add_slide_header(s2, "Traditional Dining Problems vs. Svad Digital Platform", 
                     "INDUSTRY COMPARISON", 
                     "Kyun traditional paper menu restaurants ko nuksan deta hai aur digital website munafa badhati hai.",
                     badge="⚡ ROI: +35% PROFIT", badge_color=EMERALD)

    # Left: Traditional
    add_styled_card(s2, 0.8, 1.85, 5.65, 4.25, "❌ Traditional Paper & Manual System", [
        "High Printing Expenses: Bar-bar paper menu fatne ya price badalne par saal ka ₹18,000–₹24,000 kharch.",
        "Waiter Dependency: Evening rush me 15-20 tables par waiters kam pad jate hain aur delay hota hai.",
        "Ordering Delays: Customer ko waiter aane ka 10-15 minute tak intezar karna padta hai.",
        "Handwritten KOT Mistakes: Waiter ki galat likhai se galat dish ban jati hai aur khana waste hota hai.",
        "Fake & Remote Orders: Koi bhi door se order dekar tandoor me mehengi chaap waste karwa deta hai.",
        "End of Day Math Stress: Raat ko kacchi parchi aur cash register jodne me 1 ghanta lagta hai."
    ], RED, tag="HIGH COST", bg_tint=RED_BG)

    # Right: Svad Platform
    add_styled_card(s2, 6.88, 1.85, 5.65, 4.25, "✨ Svad Digital Platform (Our Solution)", [
        "₹0 Menu Printing Cost: Nayi dish, live price aur photo 1 second me online update bina kisi kharche ke.",
        "Instant Self-Ordering: Customer table QR scan karke 30 second me apna order place karta hai.",
        "Counter Service Bell: Kitchen me turant 'Ding-Dong!' chime sound bajti hai jisse order miss nahi hota.",
        "100% Visual Accuracy: HD photos aur Single/Half/Full portion size dekhkar customer exact order deta hai.",
        "2-Step Seat Verification: Table par customer baithe hone par hi order confirm hota hai.",
        "Live 'Aaj Ka Hisab': Midnight par bina kisi calculator ke tarikh-wise gross sale aur report ready."
    ], EMERALD, tag="EFFICIENT", bg_tint=EMERALD_BG)

    # Bottom Metric Strip
    m1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.25), Inches(5.65), Inches(0.65))
    m1.fill.solid()
    m1.fill.fore_color.rgb = CARD_BG
    m1.line.color.rgb = RED
    tf_m1 = m1.text_frame
    p = tf_m1.paragraphs[0]
    p.text = "⏳ Traditional Table Turnaround: 45 - 55 Minutes per group"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RED

    m2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.88), Inches(6.25), Inches(5.65), Inches(0.65))
    m2.fill.solid()
    m2.fill.fore_color.rgb = CARD_BG
    m2.line.color.rgb = EMERALD
    tf_m2 = m2.text_frame
    p = tf_m2.paragraphs[0]
    p.text = "⚡ Svad Digital Table Turnaround: 25 - 35 Minutes (+40% More Customers Handled)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    # =============================================================
    # SLIDE 3: Customer Experience Advantages
    # =============================================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s3, 3)
    add_slide_header(s3, "Customer Experience: Grahak Ke Liye Aasan Aur Tez Dining", 
                     "CUSTOMER CENTRIC EXPERIENCE", 
                     "Grahak ko milta hai super-fast ordering, transparent billing aur shandaar visual menu.",
                     badge="⚡ SCAN-TO-ORDER < 30s", badge_color=GOLD)

    add_styled_card(s3, 0.8, 1.85, 3.65, 4.35, "📱 Instant Contactless QR", [
        "Table QR Standee Scan: Phone camera ya Google Lens se scan karte hi menu 1 second me open.",
        "Zero App Installation: Koi Play Store app install nahi karni padti, seedha web browser me chalta hai.",
        "Vercel Edge Global Speed: 400ms me mobile par lightweight aur fast load hota hai.",
        "100% Pure Veg Assurance: Menu me har item par clear green vegetarian badges show hote hain."
    ], GOLD, tag="CONVENIENCE")

    add_styled_card(s3, 4.84, 1.85, 3.65, 4.35, "🖼️ Visual Menu & Portions", [
        "Real Food HD Photos: Svad Special Malai Chaap, Afghani Tikka, Rolls ki real HD photos.",
        "Portion Selector: Single, Half, Full plate ke hisab se exact rate preview milta hai.",
        "Custom Cooking Notes: 'Kam Mirch', 'Extra Malai', 'Crispy' jaise instructions add kar sakte hain.",
        "Spice Level Badges: Mild, Medium, Spicy tags clearly dikhte hain taaki koi galti na ho."
    ], ORANGE, tag="TRANSPARENT")

    add_styled_card(s3, 8.88, 1.85, 3.65, 4.35, "🧾 Live Bill & Transparent Cart", [
        "Instant Cart Math: Items add karte hi live subtotal & GST calculate ho jata hai.",
        "Zero Billing Mistakes: Waiter ki galat calculation ya extra item judne ki koi sambhavna nahi.",
        "Dine-In & Takeaway: Table number ya parcel packing ka option clear rehta hai.",
        "Order Success Receipt: Screen par turant confirmation ID & preparation status dikhta hai."
    ], EMERALD, tag="ACCURATE")

    # Bottom Stat Pills
    add_kpi_stat_card(s3, 0.8, 6.3, 3.65, 0.65, "30 Sec", "Average Order Time", "Zero waiter waiting", GOLD)
    add_kpi_stat_card(s3, 4.84, 6.3, 3.65, 0.65, "100%", "Visual Clarity", "Full/Half portions", ORANGE)
    add_kpi_stat_card(s3, 8.88, 6.3, 3.65, 0.65, "0.0%", "Billing Mismatch", "Exact digital pricing", EMERALD)

    # =============================================================
    # SLIDE 4: Operations & Kitchen Advantages (With Real Admin UI Screenshot)
    # =============================================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s4, 4)
    add_slide_header(s4, "Operations & Kitchen: Restaurant Owner Aur Chef Ke Fayde", 
                     "KITCHEN & COUNTER AUTOMATION", 
                     "Real-time dual-tone sound bell, instant order updates aur zero missed tickets.",
                     badge="🔔 REAL-TIME AUDIO BELL", badge_color=GOLD)

    # Left: 2 Operational Advantage Cards
    add_styled_card(s4, 0.8, 1.85, 5.65, 2.45, "🔔 Dual-Tone Counter Service Bell", [
        "Realistic Brass Bell Sound: Naya order aate hi counter par loud 'Ding-Dong!' sound bajti hai.",
        "Background Web Notifications: Screen band ya minimize hone par bhi sound alert pop hota hai.",
        "Zero Missed Tickets: Chef ko baar-baar screen dekhne ki zaroorat nahi, bell bajte hi pata chal jata hai.",
        "Audio Mute/Unmute: Admin screen par bell volume ko on/off karne ka convenient button."
    ], GOLD, tag="AUDIO ALERT")

    add_styled_card(s4, 0.8, 4.45, 5.65, 2.5, "⚡ Zero-Lag Live Kitchen Management", [
        "0ms Optimistic UI: Action button dabate hi screen bina network delay ke turant react karti hai.",
        "Table Number Tracking: Table #1 se 20 tak ka clear status counter par live rehta hai.",
        "Item-Wise Quantity Preview: Chef ko ek nazar me dikhta hai kitni Half aur Full plate lagani hai.",
        "Permanent Cloud Archival: Ek baar serve hone ke baad record securely database me save hota hai."
    ], EMERALD, tag="WORKFLOW")

    # Right: Embedded Real Screenshot Container
    ss_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.85), Inches(5.733), Inches(5.1))
    ss_box.fill.solid()
    ss_box.fill.fore_color.rgb = CARD_BG
    ss_box.line.color.rgb = BLUE
    ss_box.line.width = Pt(1.5)

    # Title of screenshot container
    ss_title = s4.shapes.add_textbox(Inches(7.0), Inches(1.95), Inches(5.3), Inches(0.4))
    tf_sst = ss_title.text_frame
    p = tf_sst.paragraphs[0]
    p.text = "📱 LIVE ADMIN KITCHEN DASHBOARD"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = BLUE

    # Add Picture if exists
    if os.path.exists(img_admin):
        s4.shapes.add_picture(img_admin, Inches(7.0), Inches(2.4), width=Inches(5.33))
    
    # Caption under picture
    ss_cap = s4.shapes.add_textbox(Inches(7.0), Inches(6.35), Inches(5.3), Inches(0.5))
    tf_ssc = ss_cap.text_frame
    tf_ssc.word_wrap = True
    p = tf_ssc.paragraphs[0]
    p.text = "Actual Admin Portal showing live order cards, customer phone, table number & accept buttons."
    p.font.size = Pt(9.5)
    p.font.color.rgb = GRAY_MUTED

    # =============================================================
    # SLIDE 5: 2-Step Order Lifecycle Workflow (With Real Button Screenshot)
    # =============================================================
    s5 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s5, 5)
    add_slide_header(s5, "Workflow Architecture: 2-Step Seat Verification & Lifecycle", 
                     "STRICT ORDER LIFECYCLE", 
                     "Pehle verify ho ki customer table par baitha hai ya nahi, uske baad hi order complete hota hai.",
                     badge="🛡️ VERIFIED PROCESS", badge_color=EMERALD)

    # 4 Pipeline Stage Cards across top
    stages = [
        ("01. INFLOW", "Customer scans QR code & places order with custom notes.", GOLD),
        ("02. BELL CHIME", "Counter bell rings ('Ding-Dong!') & order appears in Pending.", ORANGE),
        ("03. SEAT VERIFY", "Staff verifies table presence & clicks 'Table Par Baithe Hain'.", EMERALD),
        ("04. SERVE FOOD", "Food served to guest. Staff clicks 'Order Complete Karein'.", BLUE)
    ]
    for idx, (st_t, st_d, st_c) in enumerate(stages):
        l_pos = 0.8 + idx * 2.98
        c = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(l_pos), Inches(1.85), Inches(2.8), Inches(1.4))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_BG
        c.line.color.rgb = st_c
        c.line.width = Pt(1.5)
        tf_sc = c.text_frame
        tf_sc.word_wrap = True
        p1 = tf_sc.paragraphs[0]
        p1.text = st_t
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = st_c
        p2 = tf_sc.add_paragraph()
        p2.text = st_d
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = GRAY_LIGHT
        p2.space_before = Pt(4)

    # Left Container: Operational Logic
    add_styled_card(s5, 0.8, 3.4, 6.5, 3.55, "🛡️ Strict 2-Step Safety Rules", [
        "Step 1: Seat Verification: Jab tak counter staff 'Table par baithe hain' click nahi karta, kitchen prepare nahi karta.",
        "Prevents Kitchen Food Waste: Door se aane wale fake orders tandoor par lagne se pehle hi filter ho jate hain.",
        "Step 2: Complete Button Unlock: Khana deliver hone ke baad hi final 'Order Complete' button unlock hota hai.",
        "Instant Undo Protection: Agar galti se click ho jaye to '↩ Wapas Unverify' ka button available rehta hai.",
        "Clear Separation: Pending Orders alag dikhte hain aur Completed Orders ka hisab alag banta hai."
    ], EMERALD, tag="SAFETY FIRST")

    # Right Container: Real Verification Button Screenshot
    r_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.5), Inches(3.4), Inches(5.033), Inches(3.55))
    r_box.fill.solid()
    r_box.fill.fore_color.rgb = CARD_BG
    r_box.line.color.rgb = GOLD
    r_box.line.width = Pt(1.5)

    r_title = s5.shapes.add_textbox(Inches(7.7), Inches(3.5), Inches(4.6), Inches(0.4))
    tf_rt = r_title.text_frame
    p = tf_rt.paragraphs[0]
    p.text = "🎯 REAL SEAT VERIFICATION BUTTON"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = GOLD

    if os.path.exists(img_verify):
        s5.shapes.add_picture(img_verify, Inches(8.3), Inches(3.95), height=Inches(2.4))
    
    r_cap = s5.shapes.add_textbox(Inches(7.7), Inches(6.45), Inches(4.6), Inches(0.45))
    tf_rc = r_cap.text_frame
    tf_rc.word_wrap = True
    p = tf_rc.paragraphs[0]
    p.text = "Live card button: '✓ Table par baithe hain' followed by 'Order Complete'."
    p.font.size = Pt(9.5)
    p.font.color.rgb = GRAY_MUTED

    # =============================================================
    # SLIDE 6: Anti-Fraud & Remote Order Prevention Technology
    # =============================================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s6, 6)
    add_slide_header(s6, "Security Architecture: Fake / Remote Order Se 100% Bachav", 
                     "ANTI-FRAUD & LOSS PREVENTION", 
                     "Ghr baithe ya prank orders se mehengi chaap aur paneer kharab hone se bachane ki technology.",
                     badge="🛡️ ZERO FOOD WASTE", badge_color=EMERALD)

    add_styled_card(s6, 0.8, 1.85, 3.65, 4.35, "📍 Geofence & Location Check", [
        "Distance Calculation: Browser GPS location se customer aur shop ki doori check hoti hai.",
        "Remote Warning Badge: Agar koi ghr baithe order karta hai to screen par red alert show hota hai.",
        "Immediate Action: Suspicious order aate hi staff call karke confirm kar sakta hai.",
        "Table QR Correlation: Check karta hai ki QR physical standee se scan hua ya internet link se khula."
    ], ORANGE, tag="LOCATION")

    add_styled_card(s6, 4.84, 1.85, 3.65, 4.35, "⚙️ Safety Control Buttons", [
        "Verify Button: '✓ Table Par Baithe Hain (Accept)' se kitchen alert hota hai.",
        "Reject Button: '❌ Seat Khali Hai / Fake Order (Reject)' se 1 click me cancel.",
        "Serve Complete: '✅ Step 2: Order Complete (Served)' se sale record hoti hai.",
        "Undo Accidental Clicks: Staff ke galat click par '↩ Wapas Pending' ka option hamesha rehta hai."
    ], EMERALD, tag="CONTROLS")

    add_styled_card(s6, 8.88, 1.85, 3.65, 4.35, "🔒 PIN Protected Admin Area", [
        "Master PIN Security: Resetting sales, clearing history, aur test data delete karne ke liye PIN zaroori.",
        "No Accidental Wipeouts: Counter staff galti se daily report delete nahi kar sakta.",
        "Device Fingerprinting: Mobile device model aur browser metadata card par show hota hai.",
        "Direct Phone Link: Customer ke number par 1 click me counter phone se dial ho jata hai."
    ], BLUE, tag="AUTH")

    # Bottom Callout Banner
    ban = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.35), Inches(11.733), Inches(0.6))
    ban.fill.solid()
    ban.fill.fore_color.rgb = CARD_BG
    ban.line.color.rgb = EMERALD
    tf_ban = ban.text_frame
    p = tf_ban.paragraphs[0]
    p.text = "💡 Net Result: Svad Malai Chaap Junction me fake orders ki wajah se hone wala food wastage 0% ho jata hai."
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    # =============================================================
    # SLIDE 7: High Concurrency Engine & Technical Reliability
    # =============================================================
    s7 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s7, 7)
    add_slide_header(s7, "Technical Scalability: 15–50+ Ek Sath Orders Handle Karne Ki Kshamta", 
                     "CLOUD INFRASTRUCTURE & SPEED", 
                     "Peak rush, festivals aur weekend dining par bina freeze ya hang hue chalne wala tech stack.",
                     badge="🚀 50+ CONCURRENCY", badge_color=BLUE)

    # 4 Architecture Blocks
    add_styled_card(s7, 0.8, 1.85, 2.78, 4.35, "🚀 Spring Boot & HikariCP", [
        "High-Speed Pool: 20-50 simultaneous customer requests bina queue me phase process hoti hain.",
        "Multi-Threaded: Har table ka order alag thread me execute hota hai.",
        "Zero Server Freeze: 50 orders ek sath aane par bhi system hang nahi hota.",
        "Enterprise Grade: Java 21 LTS technology par running."
    ], EMERALD, tag="CORE BACKEND")

    add_styled_card(s7, 3.78, 1.85, 2.78, 4.35, "🌐 Vercel Global Edge CDN", [
        "Fast Page Loads: Static assets poor India me 0.2 second me deliver hote hain.",
        "Low Bandwidth: Customer ke 4G/5G mobile data par bohot lightweight chalta hai.",
        "Zero Downtime: 99.9% server availability guaranteed.",
        "Instant Updates: Menu me change karte hi turant globally live."
    ], BLUE, tag="GLOBAL CDN")

    add_styled_card(s7, 6.78, 1.85, 2.78, 4.35, "💾 Dual-Storage Fail-Safe", [
        "Cloud MySQL: Primary cloud database with persistent storage.",
        "LocalStorage Fallback: Wi-Fi ya network drop hone par local memory me order safe rehta hai.",
        "Zero Lost Tickets: Ek bhi order miss ya gayab nahi hota.",
        "Cross-Device Sync: Counter tablet aur mobile dono me real-time sync."
    ], AMBER, tag="ZERO LOSS")

    add_styled_card(s7, 9.76, 1.85, 2.78, 4.35, "⚡ 0ms Optimistic UI", [
        "Instant Click Feedback: Button dabate hi bina network wait kiye screen turant update hoti hai.",
        "Background Sync: Network packet piche chupke se sync hota rehta hai.",
        "Smooth Counter Speed: Counter staff ko slow internet me bhi wait nahi karna padta.",
        "Auto-Polling: Har 2.5s me naye tickets counter par refresh hote hain."
    ], ORANGE, tag="INSTANT UI")

    # Bottom Stat Strip
    add_kpi_stat_card(s7, 0.8, 6.3, 2.78, 0.65, "< 50ms", "API Response Time", "Ultra-low latency", EMERALD)
    add_kpi_stat_card(s7, 3.78, 6.3, 2.78, 0.65, "99.9%", "Platform Uptime", "Zero server downtime", BLUE)
    add_kpi_stat_card(s7, 6.78, 6.3, 2.78, 0.65, "0 Loss", "Fail-Safe Architecture", "Dual-storage recovery", AMBER)
    add_kpi_stat_card(s7, 9.76, 6.3, 2.78, 0.65, "2.5 Sec", "Real-Time Polling", "Auto-refreshing dashboard", ORANGE)

    # =============================================================
    # SLIDE 8: Daily Sales & Business Analytics ("Aaj Ka Hisab")
    # =============================================================
    s8 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s8, 8)
    add_slide_header(s8, "Business Intelligence: Daily Sales Reporting & Analytics", 
                     "FINANCIAL REPORTING & LEDGER", 
                     "Raat ko kacchi parchi aur register jodne ki jhanjhat khatam — 1 click me 'Aaj Ka Hisab' ready.",
                     badge="💰 LIVE REVENUE COUNTER", badge_color=GOLD)

    add_styled_card(s8, 0.8, 1.85, 3.65, 4.35, "💰 Live Today's Revenue", [
        "Aaj Ki Total Sale Counter: Din bhar ki gross collection ka live ₹ counter har complete order ke sath badhta hai.",
        "Delivered vs Pending: Kitne orders serve hue aur kitne kitchen me ban rahe hain uska clear count.",
        "Average Order Value (AOV): Har customer table se kitne rupaye ki sale ban rahi hai uska live tracking.",
        "Zero Cash Discrepancy: Day-end par register ginnane ki math errors poori tarah khatam."
    ], EMERALD, tag="GROSS SALES")

    add_styled_card(s8, 4.84, 1.85, 3.65, 4.35, "📅 Tarikh-Wise Per-Day Record", [
        "Historical Date Selector: Kal, parso ya pichle mahine ki kisi bhi date ka hisab 1 click me dekhein.",
        "Financial Summary Table: Date, Total Orders, Delivered, Dine-In vs Parcel Takeaway, Gross Revenue.",
        "CA & Tax Settlement: Accounts aur accountant ko monthly audit report bhejna behad aasan.",
        "Permanent Cloud Archival: Puraane bills aur sales records kabhi lose ya chori nahi hote."
    ], GOLD, tag="HISTORICAL")

    add_styled_card(s8, 8.88, 1.85, 3.65, 4.35, "🏆 Top Selling Dishes Breakdown", [
        "Bestselling Item Ranking: Svad Malai Chaap, Afghani Tikka, Chaap Rolls me sabse zyada kya bika.",
        "Portion Demand: Half plate zyada bik rahi hai ya Full plate, uska exact data.",
        "Raw Material Planning: Agle din kitni chaap, paneer, cream aur rumali roti mangwani hai uska accurate andaza.",
        "Zero Inventory Spoilage: Low-selling items ko detect karke food waste control kar sakte hain."
    ], ORANGE, tag="INVENTORY")

    # Bottom Stat Pills
    add_kpi_stat_card(s8, 0.8, 6.3, 3.65, 0.65, "₹ Live", "Today's Gross Counter", "Updates in real-time", EMERALD)
    add_kpi_stat_card(s8, 4.84, 6.3, 3.65, 0.65, "365 Days", "Cloud Audit History", "Search any past date", GOLD)
    add_kpi_stat_card(s8, 8.88, 6.3, 3.65, 0.65, "100%", "Smart Stock Forecasting", "Zero raw material waste", ORANGE)

    # =============================================================
    # SLIDE 9: Business ROI & Financial Benefits (Munafa Aur Bachat)
    # =============================================================
    s9 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s9, 9)
    add_slide_header(s9, "Business ROI: Svad Malai Chaap Ko Hone Wale 4 Bada Labh", 
                     "FINANCIAL RETURNS & SAVINGS", 
                     "Table turnaround 40% tez, staff expense me 50% bachat, aur menu printing kharcha ₹0.",
                     badge="📈 MAX RETURN ON INVESTMENT", badge_color=EMERALD)

    # 4 Big Hero KPI Stat Cards
    add_kpi_stat_card(s9, 0.8, 1.85, 2.78, 1.55, "+40%", "Table Turnaround Speed", "Customer seating & checkout in half time. Handles 35%+ more tables during peak evening hours.", EMERALD)
    add_kpi_stat_card(s9, 3.78, 1.85, 2.78, 1.55, "50%", "Waiter Staff Cost Saved", "Order lene ke liye 3-4 waiters ki zaroorat nahi. Save ₹20,000–₹35,000 every single month.", GOLD)
    add_kpi_stat_card(s9, 6.78, 1.85, 2.78, 1.55, "₹20,000+", "Annual Printing Saved", "Zero paper menu reprint cost. Price badalna ya nayi chaap jodna 1-second me digital free.", ORANGE)
    add_kpi_stat_card(s9, 9.76, 1.85, 2.78, 1.55, "0.0%", "Order Errors & Waste", "Customer khud select karta hai aur seat verify hoti hai. Zero wrong dishes cooked in kitchen.", BLUE)

    # Comparison Table
    table_shape = s9.shapes.add_table(5, 4, Inches(0.8), Inches(3.6), Inches(11.733), Inches(3.2))
    table = table_shape.table
    table.columns[0].width = Inches(2.8)
    table.columns[1].width = Inches(2.9)
    table.columns[2].width = Inches(3.2)
    table.columns[3].width = Inches(2.833)

    headers = ["Operational Parameter", "Traditional Paper Setup", "Svad Digital Web Platform", "Direct Business Profit Impact"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = CARD_HEADER_BG
        p = cell.text_frame.paragraphs[0]
        p.text = h.upper()
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = GOLD

    rows_data = [
        ("Table Turnaround Time", "45 - 55 Minutes per dining group", "25 - 35 Minutes (Instant QR Order)", "+35% Zyada Customers Served"),
        ("Waiter Staff Requirements", "3 - 4 Dedicated Waiters for orders", "1 - 2 Runner Staff for serving only", "Save ₹25,000+ Every Month"),
        ("Menu Reprinting Expense", "₹18,000 - ₹24,000 Every Year", "₹0 (100% Free Instant Updates)", "Direct Cash Savings to Owner"),
        ("Order Errors & Food Waste", "4% - 6% Mismatched handwritten orders", "< 0.1% Visual selection & verification", "Zero Food Loss in Tandoor")
    ]

    for i, row in enumerate(rows_data):
        for j, val in enumerate(row):
            cell = table.cell(i + 1, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD_BG if i % 2 == 0 else RGBColor(16, 23, 36)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(10.5)
            if j == 0:
                p.font.bold = True
                p.font.color.rgb = WHITE
            elif j == 1:
                p.font.color.rgb = GRAY_MUTED
            elif j == 2:
                p.font.bold = True
                p.font.color.rgb = EMERALD if "₹0" in val or "Instant" in val or "0.1%" in val else WHITE
            else:
                p.font.bold = True
                p.font.color.rgb = GOLD

    # =============================================================
    # SLIDE 10: Conclusion & Restaurant Profile
    # =============================================================
    s10 = prs.slides.add_slide(blank_layout)
    apply_base_decorations(s10, 10)
    add_slide_header(s10, "Conclusion & Store Profile: Svad Malai Chaap Junction", 
                     "PRODUCTION DEPLOYMENT & SUMMARY", 
                     "A complete modern digital dining engine live in production at Sanjay Nagar, Ghaziabad.",
                     badge="🚀 100% OPERATIONAL", badge_color=EMERALD)

    # Left: Restaurant Profile
    add_styled_card(s10, 0.8, 1.85, 5.65, 4.35, "📍 Restaurant Profile & Location", [
        "Brand Identity: Svad Malai Chaap Junction (Ghaziabad).",
        "Cuisine Category: 100% Pure Vegetarian Fast-Casual Dining & Takeaway QSR.",
        "Store Address: L-127, Sanjay Nagar, Sector - 23, Ghaziabad, UP.",
        "Seating Capacity: Table #1 to Table #20 QR Standees + Dedicated Parcel Packing Counter.",
        "Signature Delicacies: Svad Special Malai Chaap, Afghani Tikka, Chaap Rolls, Paneer Gravy, Rumali Roti.",
        "Platform Status: Deployed & fully operational for daily customer and kitchen service."
    ], EMERALD, tag="STORE OVERVIEW")

    # Right: Live Platform URLs & Tech Stack
    add_styled_card(s10, 6.88, 1.85, 5.65, 4.35, "🌐 Live Cloud Platform & Technology", [
        "Live Customer Menu: https://malai-chaap-junction.vercel.app (Scan QR / Mobile Browser).",
        "Admin & Kitchen Portal: /admin (Secured with Passkey & Master PIN).",
        "Frontend Architecture: React / Next.js with Tailwind CSS hosted on Vercel Global Edge.",
        "Backend Server Engine: Spring Boot 3 & HikariCP High-Throughput Connection Pool.",
        "Database Layer: Cloud Managed High-Availability MySQL with Dual-Storage Fail-Safe.",
        "Special Features: Brass Audio Bell chime + 2-Step Seat Verification + Aaj Ka Hisab Ledger."
    ], GOLD, tag="PRODUCTION LIVE")

    # Bottom Banner
    bb = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.35), Inches(11.733), Inches(0.6))
    bb.fill.solid()
    bb.fill.fore_color.rgb = CARD_BG
    bb.line.color.rgb = GOLD
    tf_bb = bb.text_frame
    p = tf_bb.paragraphs[0]
    p.text = "✨ Svad Malai Chaap Junction: Delivering Exceptional Vegetarian Delicacies with Cutting-Edge Digital Dining Speed!"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = GOLD_LIGHT

    prs.save(output_path)
    print(f"Enhanced presentation generated successfully: {output_path}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_pptx = os.path.join(script_dir, "Svad_Malai_Chaap_Junction_Project_Presentation.pptx")
    build_presentation(output_pptx)
