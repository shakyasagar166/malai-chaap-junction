import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Professional Presentation Theme (Clean, Crisp, Standard Corporate & Food QSR)
    C_WHITE = RGBColor(255, 255, 255)
    C_BG = RGBColor(248, 250, 252)          # Clean Slate 50 #F8FAFC
    C_NAVY = RGBColor(15, 23, 42)           # Deep Slate 900 #0F172A (Primary Headings)
    C_TEXT = RGBColor(51, 65, 85)           # Slate 700 #334155 (Body text)
    C_MUTED = RGBColor(100, 116, 139)       # Slate 500 #64748B
    C_BORDER = RGBColor(226, 232, 240)      # Slate 200 #E2E8F0
    
    # Brand Accents
    C_ORANGE = RGBColor(234, 88, 12)        # Warm Tandoori Orange #EA580C
    C_AMBER = RGBColor(217, 119, 6)         # Rich Saffron Gold #D97706
    C_EMERALD = RGBColor(22, 163, 74)       # Pure Veg Green #16A34A
    C_RED = RGBColor(220, 38, 38)           # Warning Red #DC2626
    C_BLUE = RGBColor(2, 132, 199)          # Cloud Tech Blue #0284C7
    
    TOTAL_SLIDES = 11

    def apply_standard_slide_frame(slide, slide_num, category="SVAD MALAI CHAAP JUNCTION", title="Slide Title", subtitle=None):
        # 1. Slide Canvas
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

        # 2. Top Brand Header Strip
        top_strip = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.1))
        top_strip.fill.solid()
        top_strip.fill.fore_color.rgb = C_ORANGE
        top_strip.line.fill.background()

        # 3. Category Tracker
        cat_box = slide.shapes.add_textbox(Inches(0.9), Inches(0.4), Inches(9.5), Inches(0.3))
        tf_cat = cat_box.text_frame
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = C_ORANGE

        # 4. Main Slide Title
        t_box = slide.shapes.add_textbox(Inches(0.9), Inches(0.68), Inches(10.5), Inches(0.65))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = C_NAVY

        # 5. Subtitle (if any)
        if subtitle:
            sub_box = slide.shapes.add_textbox(Inches(0.9), Inches(1.28), Inches(10.5), Inches(0.4))
            tf_s = sub_box.text_frame
            tf_s.word_wrap = True
            p_s = tf_s.paragraphs[0]
            p_s.text = subtitle
            p_s.font.size = Pt(12)
            p_s.font.color.rgb = C_MUTED

        # 6. Bottom Separator & Footer
        div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(6.9), Inches(11.533), Inches(0.015))
        div.fill.solid()
        div.fill.fore_color.rgb = C_BORDER
        div.line.fill.background()

        f_left = slide.shapes.add_textbox(Inches(0.9), Inches(6.95), Inches(6.0), Inches(0.35))
        tf_fl = f_left.text_frame
        p_fl = tf_fl.paragraphs[0]
        p_fl.text = "Svad Malai Chaap Junction • Sanjay Nagar, Sector-23, Ghaziabad"
        p_fl.font.size = Pt(9)
        p_fl.font.color.rgb = C_MUTED

        f_right = slide.shapes.add_textbox(Inches(10.5), Inches(6.95), Inches(1.933), Inches(0.35))
        tf_fr = f_right.text_frame
        p_fr = tf_fr.paragraphs[0]
        p_fr.alignment = PP_ALIGN.RIGHT
        p_fr.text = f"Slide {slide_num} of {TOTAL_SLIDES}"
        p_fr.font.size = Pt(9)
        p_fr.font.bold = True
        p_fr.font.color.rgb = C_MUTED

    def add_standard_card(slide, left, top, width, height, title, points, accent_color=C_ORANGE, icon="📌"):
        # White Card Container with Subtle Shadow/Border
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1.2)

        # Left Accent Color Bar
        bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(0.12), Inches(height))
        bar.fill.solid()
        bar.fill.fore_color.rgb = accent_color
        bar.line.fill.background()

        # Card Title
        t_box = slide.shapes.add_textbox(Inches(left + 0.3), Inches(top + 0.18), Inches(width - 0.5), Inches(0.45))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = f"{icon}  {title}"
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = C_NAVY

        # Card Body / Points
        b_box = slide.shapes.add_textbox(Inches(left + 0.3), Inches(top + 0.65), Inches(width - 0.5), Inches(height - 0.75))
        tf_b = b_box.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = Inches(0)
        tf_b.margin_right = Inches(0)
        tf_b.margin_top = Inches(0)

        for i, pt in enumerate(points):
            p = tf_b.paragraphs[0] if i == 0 else tf_b.add_paragraph()
            if ":" in pt:
                head, desc = pt.split(":", 1)
                run1 = p.add_run()
                run1.text = f"• {head.strip()}: "
                run1.font.bold = True
                run1.font.size = Pt(11)
                run1.font.color.rgb = C_NAVY
                
                run2 = p.add_run()
                run2.text = desc.strip()
                run2.font.size = Pt(11)
                run2.font.color.rgb = C_TEXT
            else:
                run = p.add_run()
                run.text = f"• {pt}"
                run.font.size = Pt(11)
                run.font.color.rgb = C_TEXT

            p.space_after = Pt(8)

    # =============================================================
    # SLIDE 1: Title Slide (Standard Clean Presentation Cover)
    # =============================================================
    s1 = prs.slides.add_slide(blank_layout)
    # Hero Navy Cover
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_NAVY
    bg1.line.fill.background()

    # Top Orange Brand Bar
    bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.15))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = C_ORANGE
    bar1.line.fill.background()

    # Category Pill
    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.4), Inches(4.5), Inches(0.45))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(30, 41, 59)
    pill.line.color.rgb = C_ORANGE
    pill.line.width = Pt(1.5)
    p_pill = pill.text_frame.paragraphs[0]
    p_pill.text = "🌱 100% PURE VEGETARIAN RESTAURANT PLATFORM"
    p_pill.font.size = Pt(10)
    p_pill.font.bold = True
    p_pill.font.color.rgb = C_AMBER

    # Title & Subtitle Box
    t_box1 = s1.shapes.add_textbox(Inches(1.2), Inches(2.1), Inches(11.0), Inches(2.6))
    tf1 = t_box1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "Svad Malai Chaap Junction"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tf1.add_paragraph()
    p2.text = "Smart QR Ordering & Kitchen Automation Website Platform"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = C_AMBER
    p2.space_before = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "A comprehensive presentation detailing business advantages, 2-step verification, live sales tracking, and ROI."
    p3.font.size = Pt(13)
    p3.font.color.rgb = RGBColor(203, 213, 225)
    p3.space_before = Pt(10)

    # Presenter & Restaurant Details Card at Bottom
    c_meta = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(5.1), Inches(10.933), Inches(1.4))
    c_meta.fill.solid()
    c_meta.fill.fore_color.rgb = RGBColor(30, 41, 59)
    c_meta.line.color.rgb = RGBColor(51, 65, 85)
    tf_cm = c_meta.text_frame
    tf_cm.word_wrap = True

    p = tf_cm.paragraphs[0]
    p.text = "📍 Location: L-127, Sanjay Nagar, Sector - 23, Ghaziabad, Uttar Pradesh"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p = tf_cm.add_paragraph()
    p.text = "🌐 Live System: https://malai-chaap-junction.vercel.app  •  Admin Portal: /admin"
    p.font.size = Pt(11)
    p.font.color.rgb = C_AMBER
    p.space_before = Pt(4)

    p = tf_cm.add_paragraph()
    p.text = "💼 Prepared For: Restaurant Management, Kitchen Staff & Business Operations  •  Year 2026"
    p.font.size = Pt(10.5)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_before = Pt(4)

    # =============================================================
    # SLIDE 2: Table of Contents / Agenda (Standard PPT Feature)
    # =============================================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s2, 2, "PRESENTATION AGENDA", "Table of Contents: Key Topics Covered", 
                               "Presentation ki rooprekha aur mukhy vishay jo is deck me explain kiye gaye hain.")

    agenda_items_left = [
        ("01", "Introduction & Concept", "Svad Malai Chaap Junction & Pure Veg QSR overview."),
        ("02", "Traditional Paper Problems", "Paper menu printing costs, waiter delays & handwriting mistakes."),
        ("03", "Our Digital Solution", "Contactless QR menu, instant counter bell chime & live status."),
        ("04", "Customer Experience Advantages", "30-second ordering, visual HD menu & transparent billing.")
    ]
    agenda_items_right = [
        ("05", "Kitchen & Operational Advantages", "Real-time audio alert bell, zero missed tickets & fast UI."),
        ("06", "2-Step Seat Verification Workflow", "Fraud prevention: Verify table presence before kitchen cooking."),
        ("07", "Live Daily Sales ('Aaj Ka Hisab')", "Real-time revenue counter, date-wise reports & bestsellers."),
        ("08", "Business ROI & Cost Savings", "+40% Table turnaround, 50% staff savings & ₹20k+ print savings.")
    ]

    for idx, (num, ag_t, ag_d) in enumerate(agenda_items_left):
        top_p = 1.9 + idx * 1.15
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(top_p), Inches(5.6), Inches(0.98))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = f"{num}.  {ag_t}"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_NAVY
        p2 = tf.add_paragraph()
        p2.text = ag_d
        p2.font.size = Pt(10)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(3)

    for idx, (num, ag_t, ag_d) in enumerate(agenda_items_right):
        top_p = 1.9 + idx * 1.15
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(top_p), Inches(5.633), Inches(0.98))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = f"{num}.  {ag_t}"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_NAVY
        p2 = tf.add_paragraph()
        p2.text = ag_d
        p2.font.size = Pt(10)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(3)

    # =============================================================
    # SLIDE 3: About The Project & Restaurant
    # =============================================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s3, 3, "RESTAURANT OVERVIEW", "About Svad Malai Chaap Junction", 
                               "Pure Vegetarian dining hub transitioning into a high-tech smart restaurant.")

    add_standard_card(s3, 0.9, 1.85, 5.6, 4.8, "The Restaurant & Brand Identity", [
        "100% Pure Vegetarian QSR: Ghaziabad ka mashhur pure-veg chaap and tikka destination.",
        "Prime Location: L-127, Sanjay Nagar, Sector - 23, Ghaziabad, UP.",
        "Seating & Capacity: 20 Dine-In Tables with QR Standees + Dedicated Parcel Takeaway Counter.",
        "Signature Delicacies: Svad Special Malai Chaap, Afghani Tikka, Chaap Rolls, Gravy Handi & Rumali Roti.",
        "High Customer Footfall: Evening dinner rush me heavy dine-in aur parcel rush rehta hai."
    ], C_ORANGE, icon="🏬")

    add_standard_card(s3, 6.8, 1.85, 5.633, 4.8, "The Modern Digital Vision", [
        "Why Digitalization: Purane paper menu aur kacchi parchi se dining slow ho rahi thi.",
        "Self-Ordering QR Tech: Customer apne smartphone se direct table QR standee scan karta hai.",
        "Direct-to-Kitchen: Order lene ke liye waiter ki dependency khatam hoti hai.",
        "Financial Accuracy: Din bhar ki sale ka hisab register me jodne ke bajay automated cloud ledger me save hota hai.",
        "Zero App Friction: Customer ko koi app download nahi karni padti, seedha browser me khulta hai."
    ], C_EMERALD, icon="🎯")

    # =============================================================
    # SLIDE 4: The Problem (Traditional Paper System)
    # =============================================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s4, 4, "THE PROBLEM STATEMENT", "Traditional Paper Menus Ke 5 Bada Nuksan", 
                               "Kyun purana manual tareeka restaurant ke munafay aur customer experience ko kharab karta hai.")

    problems = [
        ("High Printing Costs", "Paper menus fatte hain, tel/gravy se gande hote hain. Price badalne par saal ka ₹18,000–₹24,000 bar-bar printing press ko dena padta hai.", C_RED),
        ("Waiter Dependency & Delay", "Evening rush me 15-20 tables par 2-3 waiters kam pad jate hain. Grahak ko menu mangwane aur order dene ke liye 10-15 minute wait karna padta hai.", C_RED),
        ("Order Mismatches & Wastage", "Shor-sharabe me waiter galat dish likh leta hai (Half ki jagah Full, ya Kam Mirch ki jagah Teekha). Grahak khana wapas bhejta hai aur food waste hota hai.", C_RED),
        ("Fake & Remote Orders", "Agar koi ghr se ya door se phone par order de de aur lene na aaye, to tandoor me mehengi chaap aur paneer kharab ho jati hai.", C_RED),
        ("Midnight Accounting Headache", "Raat ko 11-12 baje counter par kacchi parchi aur register jodne me 1 ghanta lagta hai. Cash calculation me galatiyan hoti hain.", C_RED)
    ]

    for idx, (p_t, p_d, p_c) in enumerate(problems):
        top_p = 1.85 + idx * 0.98
        c = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(top_p), Inches(11.533), Inches(0.85))
        c.fill.solid()
        c.fill.fore_color.rgb = C_WHITE
        c.line.color.rgb = C_BORDER
        c.line.width = Pt(1)
        
        # Left red alert tab
        tab = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(top_p), Inches(0.12), Inches(0.85))
        tab.fill.solid()
        tab.fill.fore_color.rgb = p_c
        tab.line.fill.background()

        tf = c.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        run1 = p.add_run()
        run1.text = f"❌  Issue {idx+1}: {p_t} — "
        run1.font.bold = True
        run1.font.size = Pt(12)
        run1.font.color.rgb = C_RED

        run2 = p.add_run()
        run2.text = p_d
        run2.font.size = Pt(11)
        run2.font.color.rgb = C_TEXT

    # =============================================================
    # SLIDE 5: The Solution (Svad Digital Platform)
    # =============================================================
    s5 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s5, 5, "OUR DIGITAL SOLUTION", "Svad Malai Chaap Web Platform: Modern Solution", 
                               "Fast, automated aur zero-error dining experience jo restaurant operations ko seamless banata hai.")

    solutions = [
        ("Instant Table QR Ordering", "Customer table par baithte hi standee scan karke 30 second me menu dekhkar khud order de deta hai. Waiter ka intezar 0 second.", C_EMERALD),
        ("Real-Time Counter Bell Chime", "Kitchen counter par loud 'Ding-Dong!' brass bell bajti hai. Naya order aate hi chef ko turant audio alert milta hai.", C_EMERALD),
        ("2-Step Seat Verification", "Staff pehle dekhta hai ki customer table par baitha hai ya nahi. Seat confirm hone par hi khana banta hai, fake orders 100% stop.", C_EMERALD),
        ("₹0 Digital Menu Updates", "Nayi dish jodna, price change karna ya photo lagana 1 second me online free ho jata hai. Printing press ka kharcha hamesha ke liye khatam.", C_EMERALD),
        ("Automatic 'Aaj Ka Hisab'", "Day-end par ek click me aaj ki total sale, delivered orders aur bestselling chaap ka hisab ready milta hai.", C_EMERALD)
    ]

    for idx, (s_t, s_d, s_c) in enumerate(solutions):
        top_p = 1.85 + idx * 0.98
        c = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(top_p), Inches(11.533), Inches(0.85))
        c.fill.solid()
        c.fill.fore_color.rgb = C_WHITE
        c.line.color.rgb = C_BORDER
        c.line.width = Pt(1)
        
        tab = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(top_p), Inches(0.12), Inches(0.85))
        tab.fill.solid()
        tab.fill.fore_color.rgb = s_c
        tab.line.fill.background()

        tf = c.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        run1 = p.add_run()
        run1.text = f"✨  Feature {idx+1}: {s_t} — "
        run1.font.bold = True
        run1.font.size = Pt(12)
        run1.font.color.rgb = C_EMERALD

        run2 = p.add_run()
        run2.text = s_d
        run2.font.size = Pt(11)
        run2.font.color.rgb = C_TEXT

    # =============================================================
    # SLIDE 6: Customer Advantages (Grahak Ke Fayde)
    # =============================================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s6, 6, "CUSTOMER ADVANTAGES", "Customer Experience: Grahak Ke Liye 4 Bada Fayde", 
                               "Grahak ko milta hai super-fast ordering, high-definition visual menu aur transparent bill.")

    add_standard_card(s6, 0.9, 1.85, 5.6, 2.3, "1. Super-Fast 30-Second Ordering", [
        "Instant Camera Scan: Kisi bhi camera ya UPI app se QR scan karte hi 1s me menu khulta hai.",
        "No App Download: Grahak ko phone ka storage ya internet waste karke app nahi dalni padti.",
        "Zero Waiter Waiting: Waiter aane ka intezar kiye bina aate hi khana order kar sakte hain."
    ], C_ORANGE, icon="⚡")

    add_standard_card(s6, 6.8, 1.85, 5.633, 2.3, "2. High-Definition Visual Menu", [
        "Real Food HD Photos: Svad Special Malai Chaap, Afghani Tikka, Rolls ki real photos.",
        "Portion Size Clarity: Single, Half aur Full portion ka rate saaf dikhta hai.",
        "Spice Level Badges: Mild, Medium, Spicy tags se bache aur bade sahi dish chun sakte hain."
    ], C_AMBER, icon="🍲")

    add_standard_card(s6, 0.9, 4.35, 5.6, 2.3, "3. Custom Chef Instructions", [
        "Personalized Notes: Grahak khud likh sakta hai: 'Kam Mirch', 'Extra Malai', 'Crispy Tandoori'.",
        "Direct to Kitchen: Instructions bina kisi waiter ke bhool ke seedha chef tak pahuchte hain.",
        "Accurate Taste: Har customer ko unke taste ke hisab se perfect dish milti hai."
    ], C_EMERALD, icon="📝")

    add_standard_card(s6, 6.8, 4.35, 5.633, 2.3, "4. 100% Transparent Live Bill", [
        "Live Subtotal & Taxes: Cart me item jodte hi exact total bill preview dikhta hai.",
        "No Hidden Charges: Bill me koi galat item ya extra charge nahi jud sakta.",
        "Dine-in vs Parcel: Table par khana hai ya pack karwana hai, aasan selection."
    ], C_BLUE, icon="🧾")

    # =============================================================
    # SLIDE 7: Kitchen & Staff Advantages (Kitchen Aur Counter Ke Fayde)
    # =============================================================
    s7 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s7, 7, "OPERATIONAL ADVANTAGES", "Restaurant Owner Aur Kitchen Staff Ke Fayde", 
                               "Kitchen me order aane se lekar serve hone tak poora system automated aur hassle-free.")

    add_standard_card(s7, 0.9, 1.85, 5.6, 2.3, "1. Brass Counter Service Bell", [
        "Audio Ding-Dong Chime: Naya order aate hi counter par loud chime bajti hai.",
        "Zero Missed Tickets: Chef ko baar-baar screen dekhne ki zaroorat nahi, bell bajte hi pata chal jata hai.",
        "Background Web Notifications: Browser tab minimize hone par bhi notification bajti hai."
    ], C_ORANGE, icon="🔔")

    add_standard_card(s7, 6.8, 1.85, 5.633, 2.3, "2. Organized Table Tracking", [
        "Table #1 se 20 Status: Har table ka alag card show hota hai (Dine-in vs Parcel).",
        "Clear Dish Quantities: Chef ko ek nazar me dikhta hai kitni Half aur kitni Full plate lagani hai.",
        "Instant Call Customer: Card par customer ka mobile number aur 1-click call link rehta hai."
    ], C_BLUE, icon="📋")

    add_standard_card(s7, 0.9, 4.35, 5.6, 2.3, "3. Zero-Lag 0ms Optimistic UI", [
        "Instant Button Reaction: Accept ya Complete button dabate hi screen bina internet delay ke react karti hai.",
        "No Screen Freezing: Slow internet hone par bhi counter staff ka kaam rukta nahi hai.",
        "Auto-Refresh: Har 2.5 second me cloud se naye orders automatically sync hote hain."
    ], C_EMERALD, icon="⚡")

    add_standard_card(s7, 6.8, 4.35, 5.633, 2.3, "4. Master PIN Security", [
        "Accidental Delete Protection: Master PIN ke bina koi bhi order ya sales report delete nahi kar sakta.",
        "Staff Access Controls: Counter staff sirf verify aur serve kar sakta hai, data modify nahi kar sakta.",
        "Complete Audit Trail: Din bhar ka har transaction securely cloud me archive rehta hai."
    ], C_AMBER, icon="🔒")

    # =============================================================
    # SLIDE 8: 2-Step Seat Verification Workflow (Step-by-Step)
    # =============================================================
    s8 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s8, 8, "SECURITY & WORKFLOW", "2-Step Seat Verification: Fraud Se Bachav Ka System", 
                               "Pehle verify ho ki customer table par baitha hai ya nahi, uske baad hi khana banta hai.")

    # 4 Steps Horizontal Chain
    steps = [
        ("Step 1", "Order Place Hua", "Customer table par baithkar QR scan karke order place karta hai. Counter bell bajti hai.", C_ORANGE),
        ("Step 2", "Table Verification", "Staff dekhta hai Table par customer baitha hai. Click karta hai: '✓ Table par baithe hain'.", C_AMBER),
        ("Step 3", "Kitchen Cooking", "Seat verify hote hi kitchen me tandoor par chaap lagti hai aur garma-garam cook hota hai.", C_EMERALD),
        ("Step 4", "Serve & Complete", "Waiter khana table par serve karta hai. Staff click karta hai: 'Order Complete Karein'.", C_BLUE)
    ]

    for idx, (st_n, st_t, st_d, st_c) in enumerate(steps):
        left_p = 0.9 + idx * 2.95
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_p), Inches(1.85), Inches(2.75), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = st_c
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = st_n.upper()
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = st_c

        p2 = tf.add_paragraph()
        p2.text = st_t
        p2.font.size = Pt(14)
        p2.font.bold = True
        p2.font.color.rgb = C_NAVY
        p2.space_before = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = st_d
        p3.font.size = Pt(10)
        p3.font.color.rgb = C_TEXT
        p3.space_before = Pt(6)

    # Why This Matters Container at bottom
    bot_card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(4.3), Inches(11.533), Inches(2.35))
    bot_card.fill.solid()
    bot_card.fill.fore_color.rgb = C_WHITE
    bot_card.line.color.rgb = C_BORDER
    bot_card.line.width = Pt(1.2)

    tf_bc = bot_card.text_frame
    tf_bc.word_wrap = True
    p = tf_bc.paragraphs[0]
    p.text = "🛡️  Is 2-Step Verification System Ka Restaurant Ko Kya Fayda Hai?"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    pts_bc = [
        "Ghr Se Fake Orders Se Bachav: Koi bhi ghr baithe ya door se order bhejkar restaurant ka mehenga tandoori item waste nahi karwa sakta.",
        "Khali Table Par Reject Ka Option: Agar table khali hai aur order aaya hai, to staff 1 click me order reject kar sakta hai bina tandoor lagaye.",
        "Khana Deliver Hone Par Hi Hisab Me Add: Khana grahak ke table par serve hone ke baad hi sale confirm hoti hai.",
        "Galti Se Click Hone Par Undo: Agar staff ne galti se verify ya complete daba diya, to '↩ Wapas Pending' ka undo button hamesha available rehta hai."
    ]
    for pt in pts_bc:
        p = tf_bc.add_paragraph()
        p.text = f"✔  {pt}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = C_TEXT
        p.space_before = Pt(4)

    # =============================================================
    # SLIDE 9: Daily Sales & Bookkeeping (Aaj Ka Hisab)
    # =============================================================
    s9 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s9, 9, "FINANCIAL REPORTING", "Business Intelligence: Daily Sales ('Aaj Ka Hisab')", 
                               "Raat ko kacchi parchi aur register jodne ki math khatam — 1 click me tarikh-wise hisab ready.")

    add_standard_card(s9, 0.9, 1.85, 3.65, 4.8, "1. Live Aaj Ki Sale Counter", [
        "Gross Collection Counter: Har complete order ke sath din bhar ki total sale live badhti hai.",
        "Delivered vs Pending: Kitne orders serve ho gaye aur kitne kitchen me ban rahe hain.",
        "Average Order Value: Har table par average kitne rupaye ka order ban raha hai.",
        "Zero Cash Gap: Raat ko register tally karne me 1 rupaye ka bhi fark nahi aata."
    ], C_EMERALD, icon="💰")

    add_standard_card(s9, 4.84, 1.85, 3.65, 4.8, "2. Tarikh-Wise Past Reports", [
        "Historical Date Selector: Kal, parso ya pichle mahine ki kisi bhi tarikh ka hisab dekhein.",
        "Daily Financial Table: Date, Total Orders, Delivered Orders, Dine-in vs Takeaway, Gross Revenue.",
        "CA & Accountant Ready: Monthly tax aur hisab-kitab ke liye clear clean report.",
        "Safe in Cloud: Purane registers kho jaane ya barish me kharab hone ka darr khatam."
    ], C_AMBER, icon="📅")

    add_standard_card(s9, 8.78, 1.85, 3.65, 4.8, "3. Bestselling Dishes Breakdown", [
        "Top Selling Ranking: Svad Special Malai Chaap, Afghani Tikka, Rolls me sabse zyada kya bika.",
        "Half vs Full Demand: Customers Half plate zyada mang rahe hain ya Full, exact breakdown.",
        "Raw Material Planning: Agle din kitni chaap, paneer, cream aur rumali roti lani hai uska accurate andaza.",
        "Zero Spoilage: Low-selling items ko track karke raw material wastage roka ja sakta hai."
    ], C_ORANGE, icon="🏆")

    # =============================================================
    # SLIDE 10: Business ROI & Cost Savings (Fayde Aur Munafa)
    # =============================================================
    s10 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s10, 10, "BUSINESS ROI & FINANCIAL IMPACT", "Restaurant Ko Hone Wale Arthik Labh (ROI)", 
                               "Clear financial metrics jo restaurant ki daily profitability aur table turnaround ko badhate hain.")

    # 4 Stat Metric Cards Across Top
    roi_metrics = [
        ("+40%", "Table Turnaround Speed", "Seating & ordering in half time. Handles 35%+ more customers during peak dinner rush.", C_EMERALD),
        ("50%", "Staff Salary Savings", "Order lene ke liye 3-4 waiters ki zaroorat nahi. Save ₹20,000 - ₹35,000 every single month.", C_ORANGE),
        ("₹20,000+", "Annual Printing Saved", "Zero paper menu reprint cost. 1-second me nayi dish aur live price digital update.", C_AMBER),
        ("0.0%", "Food Wastage / Error", "Customer khud select karta hai aur seat verify hoti hai. Zero wrong food prep in kitchen.", C_BLUE)
    ]

    for idx, (val, lbl, sub, col) in enumerate(roi_metrics):
        left_p = 0.9 + idx * 2.95
        card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_p), Inches(1.85), Inches(2.75), Inches(1.75))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = val
        p1.font.size = Pt(28)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = lbl.upper()
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = C_NAVY
        p2.space_before = Pt(2)

        p3 = tf.add_paragraph()
        p3.text = sub
        p3.font.size = Pt(9)
        p3.font.color.rgb = C_MUTED
        p3.space_before = Pt(3)

    # Standard Comparison Table
    tbl_shape = s10.shapes.add_table(5, 4, Inches(0.9), Inches(3.8), Inches(11.533), Inches(2.8))
    tbl = tbl_shape.table
    tbl.columns[0].width = Inches(2.8)
    tbl.columns[1].width = Inches(2.9)
    tbl.columns[2].width = Inches(3.1)
    tbl.columns[3].width = Inches(2.733)

    headers = ["Karyapranaali (Parameter)", "Traditional Paper Setup", "Svad Digital Platform", "Direct Business Impact"]
    for j, h in enumerate(headers):
        cell = tbl.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_NAVY
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

    rows_data = [
        ("Table Turnaround Time", "45 - 55 Minutes per dining group", "25 - 35 Minutes (Instant QR Order)", "+35% Zyada Grahak Serve Hote Hain"),
        ("Waiter Staff Requirements", "3 - 4 Dedicated Waiters for orders", "1 - 2 Runner Staff for serving only", "Save ₹25,000+ Har Mahine Salary"),
        ("Menu Reprinting Expense", "₹18,000 - ₹24,000 Saal Ka Kharcha", "₹0 (100% Free Instant Online Updates)", "Owner Ki Direct Cash Bachat"),
        ("Order Errors & Food Waste", "4% - 6% Galat likhai aur food return", "< 0.1% Visual selection & verification", "Tandoor Me Food Wastage 0%")
    ]

    for i, row in enumerate(rows_data):
        for j, val in enumerate(row):
            cell = tbl.cell(i + 1, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_WHITE if i % 2 == 0 else RGBColor(241, 245, 249)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(10)
            if j == 0:
                p.font.bold = True
                p.font.color.rgb = C_NAVY
            elif j == 1:
                p.font.color.rgb = C_MUTED
            elif j == 2:
                p.font.bold = True
                p.font.color.rgb = C_EMERALD if "₹0" in val or "Instant" in val or "0.1%" in val else C_NAVY
            else:
                p.font.bold = True
                p.font.color.rgb = C_ORANGE

    # =============================================================
    # SLIDE 11: Summary & Live Platform Access (Thank You Slide)
    # =============================================================
    s11 = prs.slides.add_slide(blank_layout)
    bg11 = s11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg11.fill.solid()
    bg11.fill.fore_color.rgb = C_NAVY
    bg11.line.fill.background()

    top_strip11 = s11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.15))
    top_strip11.fill.solid()
    top_strip11.fill.fore_color.rgb = C_ORANGE
    top_strip11.line.fill.background()

    # Thank you header
    t_box11 = s11.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(11.0), Inches(1.8))
    tf11 = t_box11.text_frame
    tf11.word_wrap = True
    p = tf11.paragraphs[0]
    p.text = "Dhanyawad! (Thank You)"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tf11.add_paragraph()
    p2.text = "Svad Malai Chaap Junction — Ek Aadhunik, Tez Aur Munafewali Digital Dining Platform"
    p2.font.size = Pt(18)
    p2.font.color.rgb = C_AMBER
    p2.space_before = Pt(8)

    # 2 Info Cards on Thank You Slide
    c1 = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(3.2), Inches(5.3), Inches(3.2))
    c1.fill.solid()
    c1.fill.fore_color.rgb = RGBColor(30, 41, 59)
    c1.line.color.rgb = RGBColor(51, 65, 85)
    tf_c1 = c1.text_frame
    tf_c1.word_wrap = True
    p = tf_c1.paragraphs[0]
    p.text = "📍 Restaurant Profile"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.space_after = Pt(8)

    pts1 = [
        "Brand: Svad Malai Chaap Junction",
        "Category: 100% Pure Vegetarian QSR & Dining",
        "Address: L-127, Sanjay Nagar, Sector - 23, Ghaziabad",
        "Setup: 20 Dine-In Tables (QR Standees) + Parcel Counter",
        "Famous Dishes: Malai Chaap, Afghani Tikka, Rolls & Gravy",
        "Deployment: Fully Live & Operational in Production"
    ]
    for pt in pts1:
        p = tf_c1.add_paragraph()
        p.text = f"• {pt}"
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(4)

    c2 = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(3.2), Inches(5.333), Inches(3.2))
    c2.fill.solid()
    c2.fill.fore_color.rgb = RGBColor(30, 41, 59)
    c2.line.color.rgb = RGBColor(51, 65, 85)
    tf_c2 = c2.text_frame
    tf_c2.word_wrap = True
    p = tf_c2.paragraphs[0]
    p.text = "🌐 Live System Links & Tech Stack"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(8)

    pts2 = [
        "Customer Live Website: https://malai-chaap-junction.vercel.app",
        "Admin & Kitchen Portal: /admin (Secured with Passkey & PIN)",
        "Frontend: Next.js & React on Vercel Global Edge CDN",
        "Backend Engine: Spring Boot 3 & HikariCP Connection Pool",
        "Database: Managed MySQL Cloud High-Availability Engine",
        "Audio Bell: Dual-Tone Counter Brass Bell Chime System"
    ]
    for pt in pts2:
        p = tf_c2.add_paragraph()
        p.text = f"• {pt}"
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(4)

    # Footer on Slide 11
    f11 = s11.shapes.add_textbox(Inches(1.2), Inches(6.75), Inches(10.9), Inches(0.4))
    tf_f11 = f11.text_frame
    p = tf_f11.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "Ready for Questions & Live Demonstration • 2026 Edition"
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(148, 163, 184)

    prs.save(output_path)
    print(f"Standard clean PowerPoint presentation created at: {output_path}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(script_dir, "Svad_Malai_Chaap_Junction_Project_Presentation.pptx")
    create_presentation(out_file)
