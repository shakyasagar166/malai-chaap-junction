package com.malaichaap.junction.seeder;

import com.malaichaap.junction.model.Category;
import com.malaichaap.junction.model.MenuItem;
import com.malaichaap.junction.model.RestaurantInfo;
import com.malaichaap.junction.repository.CategoryRepository;
import com.malaichaap.junction.repository.MenuItemRepository;
import com.malaichaap.junction.repository.RestaurantInfoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepo;
    private final MenuItemRepository menuRepo;
    private final RestaurantInfoRepository infoRepo;

    public DataSeeder(CategoryRepository categoryRepo, MenuItemRepository menuRepo, RestaurantInfoRepository infoRepo) {
        this.categoryRepo = categoryRepo;
        this.menuRepo = menuRepo;
        this.infoRepo = infoRepo;
    }

    @Override
    public void run(String... args) {
        // Seed Restaurant Info
        if (infoRepo.count() == 0) {
            RestaurantInfo info = new RestaurantInfo();
            info.setName("Svad Malai Chaap Junction");
            info.setTagline("Ghaziabad's Premier Tandoori & Chaap Specialities - 100% Pure Veg");
            info.setAddress("L-127, Sanjay Nagar, Sector - 23, Ghaziabad");
            info.setPhonePrimary("99-1101-3993");
            info.setPhoneSecondary("89-2929-9898");
            info.setWhatsappNumber("919911013993");
            info.setOpeningHours("12:00 PM - 11:30 PM (All 7 Days)");
            info.setPureVeg(true);
            info.setGstRate(5.0);
            infoRepo.save(info);
        }

        if (categoryRepo.count() > 0) {
            return; // Data already seeded
        }

        // 1. Veg. Tandoori
        Category c1 = categoryRepo.save(new Category("VEG. TANDOORI", "veg-tandoori", "Smoky charcoal grilled authentic soya chaaps and veg tandoori delicacies", "Flame", 1));
        // 2. Veg. Roll
        Category c2 = categoryRepo.save(new Category("VEG. ROLL", "veg-roll", "Freshly tossed tandoori chaap wrapped in flaky roomali and parathas", "WrapText", 2));
        // 3. Chaap Gravy
        Category c3 = categoryRepo.save(new Category("CHAAP GRAVY", "chaap-gravy", "Simmered in rich tawa, handi and Mughlai gravies", "Soup", 3));
        // 4. Veg. Daal
        Category c4 = categoryRepo.save(new Category("VEG. DAAL", "veg-daal", "Slow-cooked authentic Amritsari and Makhni dal preparations", "UtensilsCrossed", 4));
        // 5. Svad Paneer Gravy
        Category c5 = categoryRepo.save(new Category("SVAD PANEER GRAVY", "paneer-gravy", "Fresh cottage cheese in luscious creamy, kadhai and butter gravies", "Sparkles", 5));
        // 6. Breads
        Category c6 = categoryRepo.save(new Category("BREADS", "breads", "Freshly baked tandoori rotis, garlic naans and stuffed paranthas", "Wheat", 6));
        // 7. Rice
        Category c7 = categoryRepo.save(new Category("RICE", "rice", "Aromatic basmati pulao, jeera rice, fried rice and dum biryani", "Bowl", 7));
        // 8. Raita
        Category c8 = categoryRepo.save(new Category("RAITA", "raita", "Chilled curd, boondi raita and cooling refreshing accompaniment", "Milk", 8));
        // 9. Noodles
        Category c9 = categoryRepo.save(new Category("NOODLES", "noodles", "Wok tossed Chinese noodles with crunchy garden vegetables", "Salad", 9));
        // 10. Potato Masti
        Category c10 = categoryRepo.save(new Category("POTATO MASTI", "potato-masti", "Crispy chilli potatoes, French fries and wok tossed chilli paneer", "Cookie", 10));
        // 11. Special Tikka
        Category c11 = categoryRepo.save(new Category("SPECIAL TIKKA", "special-tikka", "Tender marinated paneer and mushroom tikkas roasted in tandoor", "Flame", 11));
        // 12. Momos Magic
        Category c12 = categoryRepo.save(new Category("MOMOS MAGIC", "momos-magic", "Steamed, kurkure, tandoori and gravy momos (Half 6 pcs / Full 10 pcs)", "Package", 12));
        // 13. King Rolls
        Category c13 = categoryRepo.save(new Category("KING ROLLS", "king-rolls", "Jumbo signature rolls loaded with tandoori paneer & crunchy veggies", "Crown", 13));

        List<MenuItem> items = new ArrayList<>();

        // Category 1: VEG. TANDOORI (19 items)
        items.add(new MenuItem("MALAI CHAAP", c1, "Rich, melt-in-mouth soya chaap coated in cashew malai cream, cardamom and tandoor grilled.", 130.0, 190.0, null, false, null, true, true, "Mild", "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"));
        items.add(new MenuItem("PUDINA CHAAP", c1, "Succulent soya chaap infused with fresh mint, coriander and roasted cumin.", 140.0, 190.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("ACHARI CHAAP", c1, "Tangy tandoori chaap marinated with aromatic Panch Phoron pickle spices.", 140.0, 190.0, null, false, null, false, false, "Spicy", null));
        items.add(new MenuItem("LEMON CHAAP", c1, "Zesty chaap with crushed black pepper, lemon zest and yellow mustard.", 140.0, 190.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("KHATTI MEETHI CHAAP", c1, "Sweet tamarind and tangy spiced glaze over crispy charcoal roasted chaap.", 140.0, 200.0, null, false, null, false, false, "Mild", null));
        items.add(new MenuItem("MASALA CHAAP", c1, "Delhi style spicy red masala marinated soya chaap grilled on skewers.", 140.0, 200.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("GARLIC CHAAP", c1, "Infused with roasted garlic cloves, cracked pepper and spiced yogurt.", 150.0, 200.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("CHAAP TIKKA", c1, "Classic tandoori tikka style chaap served with bell peppers and roasted onion.", 150.0, 200.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("AFGANI CHAAP", c1, "Mild, creamy white gravy marinade with curd, fresh cream and mild spices.", 150.0, 200.0, null, false, null, true, true, "Mild", null));
        items.add(new MenuItem("SUNNY LEONI CHAAP", c1, "Chef's special double marinated sensational chaap with exotic tandoori glaze.", 160.0, 200.0, null, false, null, true, false, "Medium", null));
        items.add(new MenuItem("MIA KHALIFA CHAAP", c1, "Fiery spicy tandoori chaap with extra kick of peri peri and red chilies.", 160.0, 200.0, null, false, null, true, false, "Spicy", null));
        items.add(new MenuItem("STUFF CHAAP", c1, "Soya chaap stuffed with seasoned cottage cheese, dry fruits and herbs.", 160.0, 220.0, null, false, null, true, false, "Mild", null));
        items.add(new MenuItem("VEG. LOLLIPOP CHAAP", c1, "Crispy skinned lollipop style soya chaap served with mint chutney.", 160.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. CHICKEN LOLLIPOP", c1, "100% vegetarian chicken-style texture seasoned with secret herbs.", 160.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. LEG PIECE", c1, "Signature vegetarian leg piece chaap marinated in rich tandoori tikka masala.", 160.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. SEEKH KABAB", c1, "Minced soya, veggies and aromatic spices skewered and tandoor roasted.", 170.0, 240.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("MUSHROOM TIKKA", c1, "Juicy button mushrooms marinated in tandoori yogurt marinade and roasted.", 170.0, 240.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("VEG. MUTTON TIKKA", c1, "Plant-based tender mutton texture marinated in robust Mughlai spices.", 170.0, 240.0, null, false, null, true, false, "Spicy", null));
        items.add(new MenuItem("VEG. TANDOORI TIKKA", c1, "Assorted smoky roasted vegetable and paneer tikka skewers.", 170.0, 240.0, null, false, null, false, false, "Medium", null));

        // Category 2: VEG. ROLL (19 items)
        items.add(new MenuItem("MALAI CHAAP ROLL", c2, "Velvety malai chaap wrapped in soft roomali with onions and mint sauce.", 150.0, 210.0, null, false, null, true, true, "Mild", null));
        items.add(new MenuItem("PUDINA CHAAP ROLL", c2, "Cooling mint chaap roll with crunchy onions and spiced drizzle.", 160.0, 210.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("ACHARI CHAAP ROLL", c2, "Pickled achari chaap wrapped fresh with chatpata masala.", 160.0, 210.0, null, false, null, false, false, "Spicy", null));
        items.add(new MenuItem("LEMON CHAAP ROLL", c2, "Zesty lemon chaap roll with fresh lime dressing.", 160.0, 210.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("KHATTI MEETHI CHAAP ROLL", c2, "Sweet and tangy chaap filling in crisp roll wrap.", 160.0, 220.0, null, false, null, false, false, "Mild", null));
        items.add(new MenuItem("MASALA CHAAP ROLL", c2, "Spiced tandoori chaap chunks wrapped with roasted spices.", 160.0, 220.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("GARLIC CHAAP ROLL", c2, "Garlic infused chaap roll with creamy mayo and mint dips.", 170.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("CHAAP TIKKA ROLL", c2, "Smoked chaap tikka chunks with capsicum and onion.", 170.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("AFGANI CHAAP ROLL", c2, "Creamy Afghani chaap wrapped in fresh flaky bread.", 170.0, 220.0, null, false, null, true, true, "Mild", null));
        items.add(new MenuItem("SUNNY LEONI CHAAP ROLL", c2, "Special double spiced chaap roll with rich sauces.", 180.0, 220.0, null, false, null, true, false, "Medium", null));
        items.add(new MenuItem("MIA KHALIFA CHAAP ROLL", c2, "Ultra spicy fiery roll with peri-peri glaze.", 180.0, 220.0, null, false, null, true, false, "Spicy", null));
        items.add(new MenuItem("STUFF CHAAP ROLL", c2, "Stuffed paneer soya chaap roll rich in creamy fillings.", 180.0, 220.0, null, false, null, true, false, "Mild", null));
        items.add(new MenuItem("VEG. LOLLIPOP CHAAP ROLL", c2, "Lollipop chaap rolled with secret spiced chutney.", 190.0, 260.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. CHICKEN LOLLIPOP ROLL", c2, "Vegetarian chicken lollipop roll packed with flavours.", 190.0, 260.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. LEG PIECE ROLL", c2, "Vegetarian leg piece chunks rolled with onions and herbs.", 190.0, 260.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. SEEKH KABAB ROLL", c2, "Tender roasted veg seekh kababs rolled with special masala.", 190.0, 260.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("MUSHROOM TIKKA ROLL", c2, "Tandoori mushroom tikka wrapped with crisp peppers.", 190.0, 260.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. MUTTON TIKKA ROLL", c2, "Rich plant mutton tikka wrapped with Mughlai flavors.", 190.0, 260.0, null, false, null, true, false, "Spicy", null));
        items.add(new MenuItem("VEG. TANDOORI TIKKA ROLL", c2, "Mixed tandoori vegetable tikka wrapped in warm roomali.", 190.0, 260.0, null, false, null, false, false, "Medium", null));

        // Category 3: CHAAP GRAVY (22 items)
        items.add(new MenuItem("CHANA MASALA", c3, "Tender chickpeas simmered in authentic Amritsari dark spiced gravy.", 140.0, 200.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("DUM ALOO", c3, "Baby potatoes cooked in rich Kashmiri tomato and yogurt gravy.", 150.0, 210.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("MASALA CHAAP", c3, "Soya chaap cooked in thick onion-tomato gravy with freshly roasted spices.", 150.0, 220.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("TAWA CHAAP", c3, "Sizzling iron tawa cooked chaap with coarse masalas and capsicum.", 160.0, 230.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("KADHAI CHAAP", c3, "Wok cooked chaap with crushed coriander, dry red chilies and bell peppers.", 160.0, 230.0, null, false, null, false, false, "Spicy", null));
        items.add(new MenuItem("PUNJABI CHAAP", c3, "Homestyle Punjabi gravy with rich garlic, ginger and aromatic tadka.", 160.0, 230.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("KEEMA CHAAP", c3, "Minced soya keema gravy topped with juicy chaap chunks.", 180.0, 240.0, null, false, null, true, false, "Medium", null));
        items.add(new MenuItem("SOYA CHAAP", c3, "Classic soya chaap simmered gently in traditional North Indian curry.", 160.0, 240.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("AMRITSARI CHAAP", c3, "Rich and buttery gravy flavored with dried kasoori methi and Amritsari spices.", 180.0, 240.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. BELI RAM CHAAP", c3, "Chef Beli Ram style slow-cooked gravy with crushed whole spices and curd.", 180.0, 240.0, null, false, null, true, false, "Medium", null));
        items.add(new MenuItem("VEG. BUTTER CHICKEN", c3, "100% veg chicken soya chaap simmered in silky tomato butter makhani gravy.", 180.0, 240.0, null, false, null, true, true, "Mild", null));
        items.add(new MenuItem("VEG. TAWA CHICKEN", c3, "Vegetarian chicken chaap sizzled on flat tawa with thick semi-dry gravy.", 180.0, 240.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. CHICKEN DO PYAZA", c3, "Loaded with sweet sautéed onions, caramelised gravy and tender chaap.", 180.0, 240.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. RARA MEAT", c3, "Plant meat chaap cooked in rich minced keema gravy with Mughlai herbs.", 180.0, 240.0, null, false, null, true, false, "Spicy", null));
        items.add(new MenuItem("BUTTER CHAAP", c3, "Luscious golden butter gravy infused with fragrant spices and tender chaap.", 180.0, 240.0, null, false, null, false, true, "Mild", null));
        items.add(new MenuItem("ROGAN JOSH CHAAP", c3, "Aromatic Kashmiri style gravy infused with ratanjot and fennel notes.", 190.0, 250.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("CHAAP TAKA TAK", c3, "Sizzling spicy chaap tossed on iron pan with quick spices and green chilies.", 190.0, 250.0, null, false, null, false, true, "Spicy", null));
        items.add(new MenuItem("SVAD SPECIAL CHAAP", c3, "House signature royal chaap cooked in secret double-gravy blend with nuts.", 210.0, 300.0, null, false, null, true, true, "Medium", null));
        items.add(new MenuItem("VEG. CHAMPARAN CHICKEN", c3, "Ahuna claypot style slow simmered vegetarian chicken chaap with whole garlic bulbs.", 210.0, 280.0, null, false, null, true, false, "Spicy", null));
        items.add(new MenuItem("VEG. HANDI MUTTON CHAAP", c3, "Slow cooked inside earthenware handi with royal aromatic spices.", 210.0, 280.0, null, false, null, true, false, "Medium", null));
        items.add(new MenuItem("KADHAI MUSHROOM CHAAP", c3, "Button mushrooms and soya chaap tossed in spicy coarse kadhai gravy.", 210.0, 280.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("VEG. KAATHI GRAVY WITH 2 RUMALI", c3, "Special spicy kaathi gravy chaap served hot along with 2 fresh Rumali Rotis.", 210.0, 280.0, null, false, "Served with 2 Rumali Rotis", true, true, "Medium", null));

        // Category 4: VEG. DAAL (5 items)
        items.add(new MenuItem("AMRITSARI DAAL", c4, "Classic dhaba style Punjabi lentil preparation tempered with desi ghee.", 140.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("DAAL HANDI", c4, "Slow simmered handi daal with aromatic herbs and tempered garlic.", 140.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("DAAL MAKHNI", c4, "Overnight simmered black lentils cooked with butter and cream.", 150.0, 240.0, null, false, null, true, true, "Mild", null));
        items.add(new MenuItem("DAAL TADKA", c4, "Yellow toor daal tempered with cumin, garlic and hing (500 ml container).", null, null, 160.0, true, "500 ml.", false, true, "Medium", null));
        items.add(new MenuItem("DAAL FRY", c4, "Homestyle comfort yellow dal fried with onions, tomatoes and green chilies.", null, null, 160.0, true, "500 ml.", false, false, "Medium", null));

        // Category 5: SVAD PANEER GRAVY (16 items)
        items.add(new MenuItem("MIX VEG.", c5, "Seasonal garden fresh vegetables tossed in spiced onion tomato masala.", 140.0, 200.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("MATAR PANEER", c5, "Fresh green peas and soft paneer cubes in comforting homestyle gravy.", 150.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("SAHI PANEER", c5, "Royal sweet and velvety cashew gravy cooked with fresh cottage cheese.", 150.0, 220.0, null, false, null, false, true, "Mild", null));
        items.add(new MenuItem("KADHAI PANEER", c5, "Cottage cheese tossed with crunchy bell peppers and fresh roasted kadhai masala.", 170.0, 240.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("MATAR MASHROOM", c5, "Juicy button mushrooms and sweet peas in rich gravy.", 170.0, 240.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("PANEER TAKA TAK", c5, "Spicy iron griddle cooked paneer with crunchy onions and chilies.", 180.0, 250.0, null, false, null, false, false, "Spicy", null));
        items.add(new MenuItem("PANEER CHAAP", c5, "Delicious combination of tender soya chaap and paneer cubes in gravy.", 180.0, 250.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("PANEER BUTTER MASALA", c5, "Rich creamy tomato gravy loaded with soft paneer and fresh butter.", 180.0, 250.0, null, false, null, true, true, "Mild", null));
        items.add(new MenuItem("PANEER DO PYAZA", c5, "Paneer cubes prepared with diced onions cooked at two different stages.", 190.0, 250.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("PANEER PASANDA", c5, "Stuffed paneer sandwiches simmered in rich saffron cashew gravy.", 190.0, 250.0, null, false, null, true, false, "Mild", null));
        items.add(new MenuItem("PANEER KORMA", c5, "Mughlai style slow cooked paneer in rich almond and curd gravy.", 190.0, 250.0, null, false, null, false, false, "Mild", null));
        items.add(new MenuItem("PANEER LABABDAR", c5, "Grated paneer and cheese cubes in luscious creamy tomato-onion gravy.", 200.0, 260.0, null, false, null, true, true, "Medium", null));
        items.add(new MenuItem("PANEER JALFREZI", c5, "Stir-fried paneer strips with bell peppers in tangy spicy sauce.", 220.0, 270.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("MASHROOM DO PYAZA", c5, "Button mushrooms in rich onion gravy with whole spices.", 200.0, 260.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("SVAD SPECIAL PANEER", c5, "Signature royal preparation of three paneer layers with secret gravy.", 220.0, 300.0, null, false, null, true, true, "Medium", null));
        items.add(new MenuItem("MALAI KOFTA", c5, "Melt-in-mouth cottage cheese dumplings in rich creamy velvet gravy (500 ml).", null, null, 250.0, true, "500 ml.", true, true, "Mild", null));

        // Category 6: BREADS (15 items) - all single price
        items.add(new MenuItem("TANDOORI ROTI PLAIN", c6, "Traditional crisp wheat roti baked in clay tandoor.", null, null, 12.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("RUMALI ROTI", c6, "Paper thin, soft and delicate roomali roti.", null, null, 12.0, true, "Per Pc", false, true, null, null));
        items.add(new MenuItem("BUTTER ROTI", c6, "Clay oven baked wheat roti brushed generously with butter.", null, null, 15.0, true, "Per Pc", false, true, null, null));
        items.add(new MenuItem("MAKKA ROTI", c6, "Golden cornflour roti baked fresh on tandoor.", null, null, 25.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("PLANE NAAN", c6, "Soft and fluffy refined flour tandoori naan.", null, null, 30.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("MISSI ROTI", c6, "Spiced gram flour (besan) roti with ajwain and kasoori methi.", null, null, 35.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("BUTTER NAAN", c6, "Fluffy layered tandoori naan brushed with creamy butter.", null, null, 40.0, true, "Per Pc", true, true, null, null));
        items.add(new MenuItem("LACCHA PRANTHA", c6, "Multi-layered crisp spiral whole wheat parantha.", null, null, 40.0, true, "Per Pc", false, true, null, null));
        items.add(new MenuItem("GARLIC NAAN", c6, "Topped with minced roasted garlic and fresh coriander butter.", null, null, 50.0, true, "Per Pc", true, true, null, null));
        items.add(new MenuItem("ALOO PRANTHA", c6, "Stuffed with spiced mashed potatoes and green chilies.", null, null, 50.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("STUFF NAAN", c6, "Stuffed with seasoned mix vegetables and cottage cheese.", null, null, 60.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("ALOO PYAZ", c6, "Crispy parantha stuffed with spicy potato and crunchy onions.", null, null, 60.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("PANEER NAAN", c6, "Naan stuffed with spiced grated paneer and herbs.", null, null, 70.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("MIX PRANTHA", c6, "Wholesome parantha with paneer, potatoes and vegetable stuffing.", null, null, 70.0, true, "Per Pc", false, false, null, null));
        items.add(new MenuItem("PANEER PYAZ PRANTHA", c6, "Jumbo parantha stuffed with rich grated paneer and onions.", null, null, 90.0, true, "Per Pc", true, false, null, null));

        // Category 7: RICE (5 items)
        items.add(new MenuItem("FRIED RICE", c7, "Wok tossed basmati rice with finely chopped vegetables and soy seasoning.", 80.0, 120.0, null, false, null, false, false, "Mild", null));
        items.add(new MenuItem("PLANE JEERA RICE", c7, "Fragrant long-grain basmati tempered with crackling roasted cumin.", 70.0, 110.0, null, false, null, false, false, "Mild", null));
        items.add(new MenuItem("PANEER FRIED RICE", c7, "Golden paneer cubes tossed with vegetable fried rice.", 90.0, 130.0, null, false, null, false, false, "Mild", null));
        items.add(new MenuItem("VEG. PULAO", c7, "Mildly spiced basmati rice loaded with green peas and garden veggies.", 110.0, 160.0, null, false, null, false, false, "Mild", null));
        items.add(new MenuItem("VEG. BIRYANI", c7, "Layered dum biryani with marinated soya chaap, mint and fried onions.", 120.0, 180.0, null, false, null, true, true, "Medium", null));

        // Category 8: RAITA (3 items)
        items.add(new MenuItem("PLAIN DAHI", c8, "Fresh and thick churned curd.", null, null, 50.0, true, "Bowl", false, false, null, null));
        items.add(new MenuItem("BUNDI RAITA", c8, "Chilled spiced curd with crisp gram flour boondi and roasted jeera.", null, null, 80.0, true, "Bowl", false, true, null, null));
        items.add(new MenuItem("MIX RAITA", c8, "Cooling yogurt with diced cucumbers, tomatoes, onions and chaat masala.", null, null, 90.0, true, "Bowl", false, false, null, null));

        // Category 9: NOODLES (5 items)
        items.add(new MenuItem("VEG. NOODLES", c9, "Stir fried noodles with shredded cabbage, capsicum and carrots.", 70.0, 100.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("HAKKA NOODLES", c9, "Classic street style Hakka noodles tossed with soy sauce and vinegar.", 90.0, 120.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("SINGAPURI NOODLES", c9, "Spicy thin noodles flavored with mild curry powder and chilli paste.", 90.0, 120.0, null, false, null, false, false, "Spicy", null));
        items.add(new MenuItem("GARLIC NOODLES", c9, "Wok tossed noodles infused with burnt garlic crisps and spring onions.", 130.0, 170.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("PANEER NOODLES", c9, "Loaded with soft cottage cheese cubes and crisp vegetables.", 150.0, 180.0, null, false, null, false, false, "Medium", null));

        // Category 10: POTATO MASTI (5 items)
        items.add(new MenuItem("FRENCH FRIES", c10, "Golden fried potato batons sprinkled with peri peri salt.", 60.0, 90.0, null, false, null, false, false, "Mild", null));
        items.add(new MenuItem("CHILLY POTATO", c10, "Crisp potato fingers tossed in spicy chili sauce with capsicum and sesame.", 60.0, 110.0, null, false, null, false, true, "Spicy", null));
        items.add(new MenuItem("HONEY CHILLY POTATO", c10, "Crispy potato tossed in sticky sweet honey and chilli glaze with sesame seeds.", 100.0, 130.0, null, false, null, true, true, "Medium", null));
        items.add(new MenuItem("CHILLY PANEER DRY", c10, "Wok tossed paneer cubes with green chilies, garlic and soy glaze.", 160.0, 220.0, null, false, null, false, true, "Spicy", null));
        items.add(new MenuItem("CHILLY PANEER GRAVY", c10, "Paneer in delicious Indo-Chinese spicy dark gravy.", 170.0, 230.0, null, false, null, false, false, "Spicy", null));

        // Category 11: SPECIAL TIKKA (8 items)
        items.add(new MenuItem("MALAI PANEER TIKKA", c11, "Thick cubes of cottage cheese marinated in cream, cheese and cashew paste.", 150.0, 220.0, null, false, null, true, true, "Mild", null));
        items.add(new MenuItem("PUDINA PANEER TIKKA", c11, "Paneer cubes infused with fresh mint and green chili marinade.", 150.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("MASALA PANEER TIKKA", c11, "Spicy red masala tandoori roasted paneer tikka with capsicum.", 150.0, 220.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("LEMON PANEER TIKKA", c11, "Zesty lemon and pepper marinated tandoori cottage cheese.", 150.0, 220.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("AFGANI PANEER TIKKA", c11, "Rich Afghani spiced creamy paneer skewers grilled in tandoor.", 160.0, 240.0, null, false, null, true, false, "Mild", null));
        items.add(new MenuItem("MUSHROOM TIKKA", c11, "Plump tandoori roasted button mushrooms with rich spices.", 170.0, 250.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("LEMON MUSHROOM TIKKA", c11, "Button mushrooms tossed with lemon juice, black pepper and roasted cumin.", 180.0, 260.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("ACHARI MUSHROOM TIKKA", c11, "Pickle marinated tandoori mushrooms with chatpata kick.", 180.0, 260.0, null, false, null, false, false, "Spicy", null));

        // Category 12: MOMOS MAGIC (9 items)
        items.add(new MenuItem("VEG. STEAM MOMOS", c12, "Delicate steamed dumplings stuffed with seasoned finely chopped veggies.", 70.0, 100.0, null, false, "Half 6 pcs / Full 10 pcs", false, false, "Medium", null));
        items.add(new MenuItem("PANEER STEAM MOMOS", c12, "Steamed momos filled with fresh seasoned grated paneer and herbs.", 90.0, 120.0, null, false, "Half 6 pcs / Full 10 pcs", false, true, "Medium", null));
        items.add(new MenuItem("KURKURE MOMOS (Veg.)", c12, "Extra crunchy golden crust outside, juicy veggie filling inside.", 100.0, 130.0, null, false, "Half 6 pcs / Full 10 pcs", true, true, "Medium", null));
        items.add(new MenuItem("PANEER KURKURE MOMOS", c12, "Super crispy paneer momos served with spicy schezwan dip.", 100.0, 140.0, null, false, "Half 6 pcs / Full 10 pcs", true, true, "Medium", null));
        items.add(new MenuItem("FRY MOMOS (Veg.)", c12, "Golden deep fried crispy vegetable dumplings.", 80.0, 100.0, null, false, "Half 6 pcs / Full 10 pcs", false, false, "Medium", null));
        items.add(new MenuItem("FRY PANEER", c12, "Crispy fried paneer dumplings served with red chili chutney.", 90.0, 110.0, null, false, "Half 6 pcs / Full 10 pcs", false, false, "Medium", null));
        items.add(new MenuItem("AFGHANI TANDOORI (Veg.)", c12, "Charcoal roasted momos dunked in rich Afghani malai gravy.", 110.0, 160.0, null, false, "Half 6 pcs / Full 10 pcs", true, false, "Mild", null));
        items.add(new MenuItem("PANEER AFGHANI", c12, "Tandoori paneer momos tossed in luscious creamy sauce.", 130.0, 180.0, null, false, "Half 6 pcs / Full 10 pcs", true, false, "Mild", null));
        items.add(new MenuItem("GRAVY VEG MOMOS", c12, "Momos tossed in spicy, tangy Indian Chinese gravy.", 150.0, 200.0, null, false, "Half 6 pcs / Full 10 pcs", true, false, "Spicy", null));

        // Category 13: KING ROLLS (6 items)
        items.add(new MenuItem("SPRING ROLL", c13, "Crispy fried golden rolls stuffed with seasoned noodles and vegetables.", 80.0, 120.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("MALAI PANEER ROLL", c13, "Rich malai paneer cubes rolled with spicy onions and mint cream.", 170.0, 240.0, null, false, null, true, true, "Mild", null));
        items.add(new MenuItem("PUDINA PANEER ROLL", c13, "Mint paneer roll with crisp veggies and special chatpata masala.", 170.0, 240.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("MASALA PANEER ROLL", c13, "Spicy tandoori paneer tikka rolled in warm flatbread.", 170.0, 240.0, null, false, null, false, true, "Medium", null));
        items.add(new MenuItem("LEMON PANEER ROLL", c13, "Zesty lemon pepper paneer roll wrapped fresh.", 170.0, 240.0, null, false, null, false, false, "Medium", null));
        items.add(new MenuItem("AFGANI PANEER ROLL", c13, "Creamy Afghani paneer chunks wrapped in flaky roomali bread.", 180.0, 260.0, null, false, null, true, false, "Mild", null));

        menuRepo.saveAll(items);
        System.out.println("✅ Svad Malai Chaap Junction Menu seeded successfully! Total items: " + items.size());
    }
}
