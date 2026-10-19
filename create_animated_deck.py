import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml import parse_xml
from pptx.oxml.ns import nsdecls

def create_animated_presentation(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Color Palette (Clean Standard Executive & QSR Food Deck)
    C_WHITE = RGBColor(255, 255, 255)
    C_BG = RGBColor(248, 250, 252)          # Clean Slate 50 #F8FAFC
    C_NAVY = RGBColor(15, 23, 42)           # Slate 900 #0F172A
    C_TEXT = RGBColor(51, 65, 85)           # Slate 700 #334155
    C_MUTED = RGBColor(100, 116, 139)       # Slate 500 #64748B
    C_BORDER = RGBColor(226, 232, 240)      # Slate 200 #E2E8F0
    
    # Brand Accents
    C_ORANGE = RGBColor(234, 88, 12)        # Tandoori Orange #EA580C
    C_AMBER = RGBColor(217, 119, 6)         # Rich Saffron Gold #D97706
    C_EMERALD = RGBColor(22, 163, 74)       # Pure Veg Emerald #16A34A
    C_RED = RGBColor(220, 38, 38)           # Warning Red #DC2626
    C_BLUE = RGBColor(2, 132, 199)          # Cloud Tech Blue #0284C7
    C_PURPLE = RGBColor(147, 51, 234)       # Innovation Purple #9333EA

    TOTAL_SLIDES = 16

    def add_slide_transition(slide, transition_tag):
        # In OpenXML: <p:transition spd="med">{transition_tag}</p:transition>
        xml_str = f'<p:transition {nsdecls("p")} spd="med">{transition_tag}</p:transition>'
        slide._element.append(parse_xml(xml_str))

    def apply_standard_slide_frame(slide, slide_num, category="SVAD MALAI CHAAP JUNCTION", title="Slide Title", subtitle=None, transition="<p:fade/>"):
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
        p_cat.text = f"●  {category.upper()}"
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
            p_s.font.size = Pt(11.5)
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

        # 7. Apply Animation / Slide Transition
        add_slide_transition(slide, transition)

    def add_standard_card(slide, left, top, width, height, title, points, accent_color=C_ORANGE, icon="📌"):
        # White Card Container with Clean 1.2pt Border
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
        t_box = slide.shapes.add_textbox(Inches(left + 0.3), Inches(top + 0.16), Inches(width - 0.5), Inches(0.45))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = f"{icon}  {title}"
        p_t.font.size = Pt(13.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_NAVY

        # Card Body
        b_box = slide.shapes.add_textbox(Inches(left + 0.3), Inches(top + 0.62), Inches(width - 0.5), Inches(height - 0.72))
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
                run1.font.size = Pt(10.5)
                run1.font.color.rgb = C_NAVY
                
                run2 = p.add_run()
                run2.text = desc.strip()
                run2.font.size = Pt(10.5)
                run2.font.color.rgb = C_TEXT
            else:
                run = p.add_run()
                run.text = f"• {pt}"
                run.font.size = Pt(10.5)
                run.font.color.rgb = C_TEXT

            p.space_after = Pt(7)

    # =============================================================
    # SLIDE 1: Title Slide (Cover Deck)
    # =============================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_NAVY
    bg1.line.fill.background()

    bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.15))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = C_ORANGE
    bar1.line.fill.background()

    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.4), Inches(4.8), Inches(0.45))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(30, 41, 59)
    pill.line.color.rgb = C_ORANGE
    pill.line.width = Pt(1.5)
    p_pill = pill.text_frame.paragraphs[0]
    p_pill.text = "🌱 100% PURE VEGETARIAN RESTAURANT PLATFORM"
    p_pill.font.size = Pt(10)
    p_pill.font.bold = True
    p_pill.font.color.rgb = C_AMBER

    t_box1 = s1.shapes.add_textbox(Inches(1.2), Inches(2.1), Inches(11.0), Inches(2.6))
    tf1 = t_box1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "Svad Malai Chaap Junction"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tf1.add_paragraph()
    p2.text = "Smart QR Ordering, Kitchen Automation & Live Sales Platform"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = C_AMBER
    p2.space_before = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "A modern high-speed restaurant platform engineered for fast table turnaround, zero order errors, and maximum profitability."
    p3.font.size = Pt(13)
    p3.font.color.rgb = RGBColor(203, 213, 225)
    p3.space_before = Pt(10)

    c_meta = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(5.1), Inches(10.933), Inches(1.4))
    c_meta.fill.solid()
    c_meta.fill.fore_color.rgb = RGBColor(30, 41, 59)
    c_meta.line.color.rgb = RGBColor(51, 65, 85)
    tf_cm = c_meta.text_frame
    tf_cm.word_wrap = True

    p = tf_cm.paragraphs[0]
    p.text = "📍 Store Location: L-127, Sanjay Nagar, Sector - 23, Ghaziabad, Uttar Pradesh"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p = tf_cm.add_paragraph()
    p.text = "🌐 Live System: https://malai-chaap-junction.vercel.app  •  Admin & Kitchen Portal: /admin"
    p.font.size = Pt(11)
    p.font.color.rgb = C_AMBER
    p.space_before = Pt(4)

    p = tf_cm.add_paragraph()
    p.text = "💼 Prepared For: Restaurant Management, Kitchen Operations & Business Owners  •  Year 2026"
    p.font.size = Pt(10.5)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_before = Pt(4)

    add_slide_transition(s1, "<p:fade/>")

    # =============================================================
    # SLIDE 2: Table of Contents / Agenda (Full 16 Slides)
    # =============================================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s2, 2, "PRESENTATION AGENDA", "Table of Contents: Complete Presentation Roadmap", 
                               "Is presentation me shamil sabhi 16 mahatvapoorna vishay aur unka overview.",
                               transition='<p:push dir="l"/>')

    agenda_col1 = [
        ("01", "Introduction & Concept", "Brand overview & pure-veg vision"),
        ("02", "Traditional Paper Problems", "Printing costs & waiter bottlenecks"),
        ("03", "Our Digital Web Platform", "QR self-ordering & counter chime bell"),
        ("04", "Digital Menu & Food Catalog", "Malai chaap, tikkas & portion sizes"),
        ("05", "Customer Advantages", "30-sec order, HD photos & live cart"),
        ("06", "Kitchen & Staff Advantages", "Brass bell chime, table tracking & UI"),
        ("07", "2-Step Seat Verification", "Anti-fraud order gating workflow"),
        ("08", "Peak Rush Management", "Handling 15-50+ tables simultaneously")
    ]
    agenda_col2 = [
        ("09", "Anti-Fraud & Geofencing", "Stopping remote orders & food waste"),
        ("10", "Cloud Technical Engine", "Spring Boot 3, Vercel Edge & MySQL"),
        ("11", "Live Sales ('Aaj Ka Hisab')", "Gross revenue, reports & bestsellers"),
        ("12", "Business ROI & Cost Savings", "+40% Table turnaround & ₹20k+ savings"),
        ("13", "Future Tech Roadmap", "Table UPI payments & WhatsApp receipts"),
        ("14", "Operational Best Practices", "Staff training & QR maintenance"),
        ("15", "Summary & Store Profile", "Sanjay Nagar location & tech stack"),
        ("16", "Thank You & Q&A", "Live demonstration & discussion")
    ]

    for idx, (num, ag_t, ag_d) in enumerate(agenda_col1):
        top_p = 1.85 + idx * 0.58
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(top_p), Inches(5.6), Inches(0.52))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = f"{num}.  {ag_t}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_NAVY
        run = p.add_run()
        run.text = f"  ({ag_d})"
        run.font.bold = False
        run.font.size = Pt(9.5)
        run.font.color.rgb = C_MUTED

    for idx, (num, ag_t, ag_d) in enumerate(agenda_col2):
        top_p = 1.85 + idx * 0.58
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(top_p), Inches(5.633), Inches(0.52))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_BORDER
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = f"{num}.  {ag_t}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_NAVY
        run = p.add_run()
        run.text = f"  ({ag_d})"
        run.font.bold = False
        run.font.size = Pt(9.5)
        run.font.color.rgb = C_MUTED

    # =============================================================
    # SLIDE 3: About Svad Malai Chaap Junction
    # =============================================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s3, 3, "RESTAURANT OVERVIEW", "About Svad Malai Chaap Junction", 
                               "Pure Vegetarian dining hub transitioning into a high-tech smart restaurant.",
                               transition='<p:wipe dir="l"/>')

    add_standard_card(s3, 0.9, 1.85, 5.6, 4.8, "The Restaurant & Brand Heritage", [
        "100% Pure Vegetarian QSR: Ghaziabad ka mashhur pure-veg soya chaap aur tandoori snacks destination.",
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
        "Zero App Friction: Customer ko koi app download nahi karni padti, seedha web browser me khulta hai."
    ], C_EMERALD, icon="🎯")

    # =============================================================
    # SLIDE 4: The Problem (Traditional Paper System)
    # =============================================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s4, 4, "THE PROBLEM STATEMENT", "Traditional Paper Menus Ke 5 Bada Nuksan", 
                               "Kyun purana manual tareeka restaurant ke munafay aur customer experience ko kharab karta hai.",
                               transition='<p:split orient="horz"/>')

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
                               "Fast, automated aur zero-error dining experience jo restaurant operations ko seamless banata hai.",
                               transition='<p:push dir="l"/>')

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
    # SLIDE 6 (NEW): Digital Menu Showcase & Food Catalog
    # =============================================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s6, 6, "MENU & PRODUCT CATALOG", "Digital Food Menu: Bestseller Chaap & Rolls Catalog", 
                               "High-definition photos, single/half/full portions aur transparent live pricing.",
                               transition='<p:fade/>')

    add_standard_card(s6, 0.9, 1.85, 5.6, 2.3, "1. Special Tandoori Chaap", [
        "Svad Special Malai Chaap: Rich creamy cashew-malai marinade roasted in clay tandoor.",
        "Afghani Tikka Chaap: Mild spiced, melt-in-mouth textures with lemon-butter sprinkle.",
        "Achari Chaap: Tangy pickled spices for strong traditional flavor lovers.",
        "Portion Options: Half Plate (4 Pcs) & Full Plate (8 Pcs) options clearly priced."
    ], C_ORANGE, icon="🍢")

    add_standard_card(s6, 6.8, 1.85, 5.633, 2.3, "2. Signature Chaap Rolls", [
        "Malai Chaap Roll: Grilled chaap tossed in fresh cream rolled in soft rumali.",
        "Garlic Mayo Roll: Fusion twist loaded with crispy onions & garlic dressing.",
        "Diet Chaap Roll: Oil-free roasted option with green salad dressing.",
        "Custom Notes: 'Extra Malai', 'Kam Pyaaz', 'Crispy' options customer add kar sakta hai."
    ], C_AMBER, icon="🌯")

    add_standard_card(s6, 0.9, 4.35, 5.6, 2.3, "3. Rich Main Course Gravies", [
        "Chaap Rogan Josh (Veg): Saffron infused aromatic Kashmiri gravy with soft soya.",
        "Paneer Butter Masala: Rich tomato-butter gravy with fresh soft paneer cubes.",
        "Dal Makhani Special: Slow-cooked overnight black lentils with pure desi ghee.",
        "Packaging Options: Dine-in table handi ya sealed spill-proof parcel container."
    ], C_EMERALD, icon="🍲")

    add_standard_card(s6, 6.8, 4.35, 5.633, 2.3, "4. Tandoori Breads & Sides", [
        "Rumali Roti: Fresh hand-tossed ultra thin rotis cooked on inverted tawa.",
        "Butter Garlic Naan: Crispy tandoor baked bread glazed with pure butter.",
        "Mint Chutney & Salad: Green coriander-mint dips with vinegar onion rings.",
        "Beverages: Chilled canned drinks & mineral water bottles ready for add-to-cart."
    ], C_BLUE, icon="🫓")

    # =============================================================
    # SLIDE 7: Customer Advantages (Grahak Ke Fayde)
    # =============================================================
    s7 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s7, 7, "CUSTOMER ADVANTAGES", "Customer Experience: Grahak Ke Liye 4 Bada Fayde", 
                               "Grahak ko milta hai super-fast ordering, high-definition visual menu aur transparent bill.",
                               transition='<p:wipe dir="r"/>')

    add_standard_card(s7, 0.9, 1.85, 5.6, 2.3, "1. Super-Fast 30-Second Ordering", [
        "Instant Camera Scan: Kisi bhi camera ya UPI app se QR scan karte hi 1s me menu khulta hai.",
        "No App Download: Grahak ko phone ka storage ya internet waste karke app nahi dalni padti.",
        "Zero Waiter Waiting: Waiter aane ka intezar kiye bina aate hi khana order kar sakte hain."
    ], C_ORANGE, icon="⚡")

    add_standard_card(s7, 6.8, 1.85, 5.633, 2.3, "2. High-Definition Visual Menu", [
        "Real Food HD Photos: Svad Special Malai Chaap, Afghani Tikka, Rolls ki real photos.",
        "Portion Size Clarity: Single, Half aur Full portion ka rate saaf dikhta hai.",
        "Spice Level Badges: Mild, Medium, Spicy tags se bache aur bade sahi dish chun sakte hain."
    ], C_AMBER, icon="🍲")

    add_standard_card(s7, 0.9, 4.35, 5.6, 2.3, "3. Custom Chef Instructions", [
        "Personalized Notes: Grahak khud likh sakta hai: 'Kam Mirch', 'Extra Malai', 'Crispy Tandoori'.",
        "Direct to Kitchen: Instructions bina kisi waiter ke bhool ke seedha chef tak pahuchte hain.",
        "Accurate Taste: Har customer ko unke taste ke hisab se perfect dish milti hai."
    ], C_EMERALD, icon="📝")

    add_standard_card(s7, 6.8, 4.35, 5.633, 2.3, "4. 100% Transparent Live Bill", [
        "Live Subtotal & Taxes: Cart me item jodte hi exact total bill preview dikhta hai.",
        "No Hidden Charges: Bill me koi galat item ya extra charge nahi jud sakta.",
        "Dine-in vs Parcel: Table par khana hai ya pack karwana hai, aasan selection."
    ], C_BLUE, icon="🧾")

    # =============================================================
    # SLIDE 8: Kitchen & Staff Advantages
    # =============================================================
    s8 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s8, 8, "OPERATIONAL ADVANTAGES", "Restaurant Owner Aur Kitchen Staff Ke Fayde", 
                               "Kitchen me order aane se lekar serve hone tak poora system automated aur hassle-free.",
                               transition='<p:push dir="l"/>')

    add_standard_card(s8, 0.9, 1.85, 5.6, 2.3, "1. Brass Counter Service Bell", [
        "Audio Ding-Dong Chime: Naya order aate hi counter par loud chime bajti hai.",
        "Zero Missed Tickets: Chef ko baar-baar screen dekhne ki zaroorat nahi, bell bajte hi pata chal jata hai.",
        "Background Web Notifications: Browser tab minimize hone par bhi notification bajti hai."
    ], C_ORANGE, icon="🔔")

    add_standard_card(s8, 6.8, 1.85, 5.633, 2.3, "2. Organized Table Tracking", [
        "Table #1 se 20 Status: Har table ka alag card show hota hai (Dine-in vs Parcel).",
        "Clear Dish Quantities: Chef ko ek nazar me dikhta hai kitni Half aur kitni Full plate lagani hai.",
        "Instant Call Customer: Card par customer ka mobile number aur 1-click call link rehta hai."
    ], C_BLUE, icon="📋")

    add_standard_card(s8, 0.9, 4.35, 5.6, 2.3, "3. Zero-Lag 0ms Optimistic UI", [
        "Instant Button Reaction: Accept ya Complete button dabate hi screen bina internet delay ke react karti hai.",
        "No Screen Freezing: Slow internet hone par bhi counter staff ka kaam rukta nahi hai.",
        "Auto-Refresh: Har 2.5 second me cloud se naye orders automatically sync hote hain."
    ], C_EMERALD, icon="⚡")

    add_standard_card(s8, 6.8, 4.35, 5.633, 2.3, "4. Master PIN Security", [
        "Accidental Delete Protection: Master PIN ke bina koi bhi order ya sales report delete nahi kar sakta.",
        "Staff Access Controls: Counter staff sirf verify aur serve kar sakta hai, data modify nahi kar sakta.",
        "Complete Audit Trail: Din bhar ka har transaction securely cloud me archive rehta hai."
    ], C_AMBER, icon="🔒")

    # =============================================================
    # SLIDE 9: 2-Step Seat Verification Workflow
    # =============================================================
    s9 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s9, 9, "SECURITY & WORKFLOW", "2-Step Seat Verification: Fraud Se Bachav Ka System", 
                               "Pehle verify ho ki customer table par baitha hai ya nahi, uske baad hi khana banta hai.",
                               transition='<p:split orient="horz"/>')

    steps = [
        ("Step 1", "Order Place Hua", "Customer table par baithkar QR scan karke order place karta hai. Counter bell bajti hai.", C_ORANGE),
        ("Step 2", "Table Verification", "Staff dekhta hai Table par customer baitha hai. Click karta hai: '✓ Table par baithe hain'.", C_AMBER),
        ("Step 3", "Kitchen Cooking", "Seat verify hote hi kitchen me tandoor par chaap lagti hai aur garma-garam cook hota hai.", C_EMERALD),
        ("Step 4", "Serve & Complete", "Waiter khana table par serve karta hai. Staff click karta hai: 'Order Complete Karein'.", C_BLUE)
    ]

    for idx, (st_n, st_t, st_d, st_c) in enumerate(steps):
        left_p = 0.9 + idx * 2.95
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_p), Inches(1.85), Inches(2.75), Inches(2.2))
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

    bot_card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(4.3), Inches(11.533), Inches(2.35))
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
    # SLIDE 10 (NEW): Peak Rush & Capacity Management
    # =============================================================
    s10 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s10, 10, "CAPACITY & RUSH MANAGEMENT", "Peak Rush Management: Handling 15–50+ Tables Simultaneously", 
                               "Evening 7 PM to 11 PM dinner rush me bina kisi rukawat ke fast table turnover.",
                               transition='<p:wipe dir="l"/>')

    add_standard_card(s10, 0.9, 1.85, 5.6, 2.3, "1. Zero Waiter Bottleneck", [
        "Simultaneous Orders: 20 tables ek hi minute me bina waiter ke intezar ke order de sakti hain.",
        "Instant Arrival: Har order instantly counter par brass bell chime ke sath land hota hai.",
        "No Shouting or Confusion: Shor-sharabe me parchi gumne ya waiter bhulne ka koi chance nahi."
    ], C_EMERALD, icon="⚡")

    add_standard_card(s10, 6.8, 1.85, 5.633, 2.3, "2. FIFO Kitchen Queue", [
        "First-In First-Out: Orders automatic date/time sequence me arrange rehte hain.",
        "Chef Batch Cooking: Chef ek sath 3-4 tables ke tandoori items tandoor me laga sakta hai.",
        "Clear Preparation Status: Har dish ke preparation timer ka clear visual rehta hai."
    ], C_BLUE, icon="⏱️")

    add_standard_card(s10, 0.9, 4.35, 5.6, 2.3, "3. Dine-In vs Parcel Segregation", [
        "Dual Queue Architecture: Table dining orders alag aur takeaway packing orders alag track hote hain.",
        "No Packing Mixups: Parcel customer ka number aur packing instructions bilkul distinct dikhte hain.",
        "Smoother Counter Traffic: Counter par bematlab ki bheed jama nahi hoti."
    ], C_ORANGE, icon="📦")

    add_standard_card(s10, 6.8, 4.35, 5.633, 2.3, "4. Fast Table Turnover Rate", [
        "Aadha Waiting Time: Grahak aate hi khana select karta hai, table 25-35 min me free ho jati hai.",
        "+35% Footfall Capacity: Evening rush me restaurant 35% se zyada customers ko serve kar pata hai.",
        "Higher Daily Revenue: Har ghante me zyada tables ghumeingi to direct sales me badhotari hoti hai."
    ], C_AMBER, icon="🚀")

    # =============================================================
    # SLIDE 11 (NEW): Anti-Fraud & Geofencing Architecture
    # =============================================================
    s11 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s11, 11, "SECURITY ARCHITECTURE", "Anti-Fraud Architecture: Zero Remote Order Wastage", 
                               "GPS location intelligence aur device verification se fake order se 100% bachaav.",
                               transition='<p:push dir="r"/>')

    add_standard_card(s11, 0.9, 1.85, 5.6, 2.3, "1. GPS Geofencing Intelligence", [
        "Distance Calculation: Browser GPS location se customer aur shop ki doori check hoti hai.",
        "Remote Warning Badge: Agar koi ghr baithe order karega to screen par red alert pop hoga.",
        "Immediate Verification: Suspicious distance aane par staff order accept karne se pehle check kar leta hai."
    ], C_RED, icon="📍")

    add_standard_card(s11, 6.8, 1.85, 5.633, 2.3, "2. Physical Standee QR Validation", [
        "Standee Metadata: Check karta hai ki QR physical standee se scan hua ya internet link se open hua.",
        "Table Locking: Table number parameter securely locked rehta hai taaki koi manipulate na kare.",
        "Device Fingerprint: Mobile client browser metadata card par store hota hai."
    ], C_AMBER, icon="🛡️")

    add_standard_card(s11, 0.9, 4.35, 5.6, 2.3, "3. 1-Click Customer Dial", [
        "Direct Phone Link: Admin screen par customer ke number par 1 click me phone call mil jata hai.",
        "Doubt Resolution: Confusion hone par table par aane se pehle phone par verify kiya ja sakta hai.",
        "Zero Cold Dishes: Customer phone uthaye bina mehenga item tandoor me nahi chadhta."
    ], C_BLUE, icon="📞")

    add_standard_card(s11, 6.8, 4.35, 5.633, 2.3, "4. Accidental Click Protection", [
        "Undo Functionality: Staff ke galat click par '↩ Wapas Unverify' ka button available rehta hai.",
        "Permanent Delete Controls: Test orders ko delete karne ke liye Master PIN mandatory hota hai.",
        "Cloud Audit Trail: Har order ka creation aur completion timestamp cloud me save rehta hai."
    ], C_EMERALD, icon="🔒")

    # =============================================================
    # SLIDE 12 (NEW): Technical Cloud Architecture
    # =============================================================
    s12 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s12, 12, "CLOUD INFRASTRUCTURE", "Technical Architecture: Enterprise-Grade Cloud Engine", 
                               "High concurrency, sub-50ms latency aur dual-storage fail-safe protection.",
                               transition='<p:split orient="vert"/>')

    add_standard_card(s12, 0.9, 1.85, 5.6, 2.3, "1. Spring Boot 3 & HikariCP", [
        "Enterprise Backend: Java 21 LTS technology high-throughput requests process karti hai.",
        "HikariCP Connection Pool: Database me ek sath 20-50 simultaneous requests bina hang hue handle hoti hain.",
        "Zero Crash Engine: Peak festival aur weekend rush me bhi server crash ya freeze nahi hota."
    ], C_EMERALD, icon="☕")

    add_standard_card(s12, 6.8, 1.85, 5.633, 2.3, "2. Vercel Global Edge CDN", [
        "Sub-Second Load Time: Pure India me 400ms se kam me customer ke mobile par website khulti hai.",
        "Low Bandwidth: Customer ke 4G/5G mobile data par bohot lightweight aur smooth chalta hai.",
        "99.9% Uptime: Cloud infrastructure bina kisi offline downtime ke chalna ensure karta hai."
    ], C_BLUE, icon="🌐")

    add_standard_card(s12, 0.9, 4.35, 5.6, 2.3, "3. Dual-Storage Fail-Safe", [
        "Cloud MySQL: Primary cloud database with persistent storage.",
        "LocalStorage Fallback: Wi-Fi ya network drop hone par local memory me order safe rehta hai.",
        "Zero Lost Tickets: Ek bhi order miss ya gayab nahi hota.",
        "Cross-Device Sync: Counter tablet aur mobile dono me real-time sync."
    ], C_AMBER, icon="💾")

    add_standard_card(s12, 6.8, 4.35, 5.633, 2.3, "4. 0ms Optimistic UI Engine", [
        "Instant Click Feedback: Button dabate hi bina network wait kiye screen turant update hoti hai.",
        "Background Sync: Network packet piche chupke se sync hota rehta hai.",
        "Smooth Counter Speed: Counter staff ko slow internet me bhi wait nahi karna padta.",
        "Auto-Polling: Har 2.5s me naye tickets counter par refresh hote hain."
    ], C_ORANGE, icon="⚡")

    # =============================================================
    # SLIDE 13: Daily Sales & Bookkeeping (Aaj Ka Hisab)
    # =============================================================
    s13 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s13, 13, "FINANCIAL REPORTING", "Business Intelligence: Daily Sales ('Aaj Ka Hisab')", 
                               "Raat ko kacchi parchi aur register jodne ki math khatam — 1 click me tarikh-wise hisab ready.",
                               transition='<p:push dir="l"/>')

    add_standard_card(s13, 0.9, 1.85, 3.65, 4.8, "1. Live Aaj Ki Sale Counter", [
        "Gross Collection Counter: Har complete order ke sath din bhar ki total sale live badhti hai.",
        "Delivered vs Pending: Kitne orders serve ho gaye aur kitne kitchen me ban rahe hain.",
        "Average Order Value: Har table par average kitne rupaye ka order ban raha hai.",
        "Zero Cash Gap: Raat ko register tally karne me 1 rupaye ka bhi fark nahi aata."
    ], C_EMERALD, icon="💰")

    add_standard_card(s13, 4.84, 1.85, 3.65, 4.8, "2. Tarikh-Wise Past Reports", [
        "Historical Date Selector: Kal, parso ya pichle mahine ki kisi bhi tarikh ka hisab dekhein.",
        "Daily Financial Table: Date, Total Orders, Delivered Orders, Dine-in vs Takeaway, Gross Revenue.",
        "CA & Accountant Ready: Monthly tax aur hisab-kitab ke liye clear clean report.",
        "Safe in Cloud: Purane registers kho jaane ya barish me kharab hone ka darr khatam."
    ], C_AMBER, icon="📅")

    add_standard_card(s13, 8.78, 1.85, 3.65, 4.8, "3. Bestselling Dishes Breakdown", [
        "Top Selling Ranking: Svad Special Malai Chaap, Afghani Tikka, Rolls me sabse zyada kya bika.",
        "Half vs Full Demand: Customers Half plate zyada mang rahe hain ya Full, exact breakdown.",
        "Raw Material Planning: Agle din kitni chaap, paneer, cream aur rumali roti lani hai uska accurate andaza.",
        "Zero Spoilage: Low-selling items ko track karke raw material wastage roka ja sakta hai."
    ], C_ORANGE, icon="🏆")

    # =============================================================
    # SLIDE 14: Business ROI & Cost Savings (Fayde Aur Munafa)
    # =============================================================
    s14 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s14, 14, "BUSINESS ROI & FINANCIAL IMPACT", "Restaurant Ko Hone Wale Arthik Labh (ROI)", 
                               "Clear financial metrics jo restaurant ki daily profitability aur table turnaround ko badhate hain.",
                               transition='<p:fade/>')

    roi_metrics = [
        ("+40%", "Table Turnaround Speed", "Seating & ordering in half time. Handles 35%+ more customers during peak dinner rush.", C_EMERALD),
        ("50%", "Staff Salary Savings", "Order lene ke liye 3-4 waiters ki zaroorat nahi. Save ₹20,000 - ₹35,000 every single month.", C_ORANGE),
        ("₹20,000+", "Annual Printing Saved", "Zero paper menu reprint cost. 1-second me nayi dish aur live price digital update.", C_AMBER),
        ("0.0%", "Food Wastage / Error", "Customer khud select karta hai aur seat verify hoti hai. Zero wrong food prep in kitchen.", C_BLUE)
    ]

    for idx, (val, lbl, sub, col) in enumerate(roi_metrics):
        left_p = 0.9 + idx * 2.95
        card = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_p), Inches(1.85), Inches(2.75), Inches(1.75))
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

    tbl_shape = s14.shapes.add_table(5, 4, Inches(0.9), Inches(3.8), Inches(11.533), Inches(2.8))
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
    # SLIDE 15 (NEW): Future Innovations & Technology Roadmap
    # =============================================================
    s15 = prs.slides.add_slide(blank_layout)
    apply_standard_slide_frame(s15, 15, "INNOVATION & ROADMAP", "Future Technology Roadmap: Upcoming Innovations", 
                               "Agale charan me aane wale aadhunik features jo customer dining ko aur aasan banayenge.",
                               transition='<p:wipe dir="r"/>')

    add_standard_card(s15, 0.9, 1.85, 5.6, 2.3, "1. Table-Side UPI QR Auto-Payment", [
        "Direct PhonePe/GPay: Grahak table par baithe-baithe bill ka UPI QR scan karke pay kar sakega.",
        "Instant Cashless Clearance: Payment aate hi kitchen dashboard par 'Paid' green badge aayega.",
        "Zero Cash Counter Rush: Counter par payment ke liye line lagane ki zaroorat khatam."
    ], C_EMERALD, icon="💳")

    add_standard_card(s15, 6.8, 1.85, 5.633, 2.3, "2. WhatsApp E-Receipt & Tracking", [
        "Automated WhatsApp Bill: Customer ke number par order confirmation aur itemized digital bill turant send hoga.",
        "Live Kitchen Cooking Link: 'Aapki Chaap Tandoor me lag rahi hai' status update.",
        "Paperless & Eco-Friendly: Parchi print karne ki zaroorat nahi, seedha WhatsApp par bill."
    ], C_BLUE, icon="📲")

    add_standard_card(s15, 0.9, 4.35, 5.6, 2.3, "3. Customer Loyalty & Discounts", [
        "Repeat Customer Rewards: Baar-baar aane wale regular customers ko discount points milenge.",
        "Special Festive Offers: Diwali, New Year par direct digital banner offers show honge.",
        "Higher Customer Retention: Grahak baar-baar Svad Malai Chaap Junction aana pasand karenge."
    ], C_PURPLE, icon="🎁")

    add_standard_card(s15, 6.8, 4.35, 5.633, 2.3, "4. Smart Raw Material Auto-Alerts", [
        "Low Stock Notification: Din bhar chaap aur paneer ki sale ke hisab se stock alert aayega.",
        "Daily Purchase List: Agle din mandi se kitna raw material mangwana hai uski automatic list.",
        "Zero Fresh Food Spoilage: Extra stock kharab hone se 100% bachat hogi."
    ], C_AMBER, icon="📊")

    # =============================================================
    # SLIDE 16: Summary & Live Platform Access (Thank You Slide)
    # =============================================================
    s16 = prs.slides.add_slide(blank_layout)
    bg16 = s16.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg16.fill.solid()
    bg16.fill.fore_color.rgb = C_NAVY
    bg16.line.fill.background()

    top_strip16 = s16.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.15))
    top_strip16.fill.solid()
    top_strip16.fill.fore_color.rgb = C_ORANGE
    top_strip16.line.fill.background()

    t_box16 = s16.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(11.0), Inches(1.8))
    tf16 = t_box16.text_frame
    tf16.word_wrap = True
    p = tf16.paragraphs[0]
    p.text = "Dhanyawad! (Thank You)"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p2 = tf16.add_paragraph()
    p2.text = "Svad Malai Chaap Junction — Ek Aadhunik, Tez Aur Munafewali Digital Dining Platform"
    p2.font.size = Pt(18)
    p2.font.color.rgb = C_AMBER
    p2.space_before = Pt(8)

    c1 = s16.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(3.2), Inches(5.3), Inches(3.2))
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

    c2 = s16.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(3.2), Inches(5.333), Inches(3.2))
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

    f16 = s16.shapes.add_textbox(Inches(1.2), Inches(6.75), Inches(10.9), Inches(0.4))
    tf_f16 = f16.text_frame
    p = tf_f16.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "Ready for Questions & Live Demonstration • 2026 Production Edition"
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(148, 163, 184)

    add_slide_transition(s16, "<p:fade/>")

    prs.save(output_path)
    print(f"Animated 16-slide presentation created successfully at: {output_path}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(script_dir, "Svad_Malai_Chaap_Junction_Project_Presentation.pptx")
    create_animated_presentation(out_file)
