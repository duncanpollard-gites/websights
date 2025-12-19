// Generate demo site configs for all trades
const mysql = require('mysql2/promise');

const demoConfigs = {
  plumber: {
    businessName: "Dave's Plumbing",
    trade: "plumber",
    location: "Manchester",
    phone: "0161 555 0123",
    services: ["Emergency Plumbing", "Boiler Repairs", "Bathroom Installation", "Leak Detection", "Central Heating", "Drain Unblocking"],
    tagline: "Your trusted local plumber in Manchester - Available 24/7",
    about: "Dave's Plumbing has been serving Manchester and surrounding areas for over 15 years. We pride ourselves on honest pricing, quality workmanship, and reliable service. Whether it's a leaky tap or a complete bathroom renovation, our Gas Safe registered engineers are here to help.",
    colors: { primary: "#2563eb", secondary: "#f8fafc", accent: "#10b981" },
    sections: [
      { id: "hero", type: "hero", title: "Expert Plumbing Services in Manchester", content: "From emergency repairs to full bathroom installations. No call-out fee, free quotes, and 24/7 availability.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Emergency Plumbing", description: "24/7 emergency call-outs for burst pipes, leaks, and flooding", icon: "alert-circle" },
        { title: "Boiler Repairs", description: "Gas Safe registered engineers for all boiler makes and models", icon: "flame" },
        { title: "Bathroom Installation", description: "Complete bathroom design and installation service", icon: "bath" },
        { title: "Leak Detection", description: "Advanced leak detection to find and fix hidden leaks", icon: "droplet" },
        { title: "Central Heating", description: "Radiator installation, power flushing, and system upgrades", icon: "thermometer" },
        { title: "Drain Unblocking", description: "Fast, effective drain clearing with no mess", icon: "pipe" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Dave's Plumbing?", content: "Dave's Plumbing has been serving Manchester and surrounding areas for over 15 years. We pride ourselves on honest pricing, quality workmanship, and reliable service.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "James W.", description: "Called at 2am with a burst pipe and Dave was there within 30 minutes. Fantastic service!" },
        { title: "Emma S.", description: "Our new bathroom looks amazing. Professional, tidy, and finished ahead of schedule." },
        { title: "Robert K.", description: "Been using Dave for 5 years now. Always reliable, always fair prices. Highly recommended." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready to discuss your plumbing needs? Call us on 0161 555 0123 or fill out the form below for a free quote.", visible: true },
      { id: "cta", type: "cta", title: "Need a Plumber?", content: "No call-out fee. Free quotes. 24/7 availability. Call now!", visible: true }
    ]
  },
  electrician: {
    businessName: "Spark Electric",
    trade: "electrician",
    location: "Birmingham",
    phone: "0121 555 0456",
    services: ["Electrical Installation", "Rewiring", "Fuse Box Upgrades", "EV Charger Installation", "Emergency Callouts", "Electrical Inspections"],
    tagline: "Certified electricians you can trust - Serving Birmingham since 2008",
    about: "Spark Electric is a family-run electrical company serving Birmingham and the West Midlands. All our electricians are NICEIC registered and we guarantee all work for 5 years. From simple socket installations to complete rewires, we handle it all with care and precision.",
    colors: { primary: "#f59e0b", secondary: "#1f2937", accent: "#3b82f6" },
    sections: [
      { id: "hero", type: "hero", title: "Professional Electricians in Birmingham", content: "NICEIC registered electricians for domestic and commercial work. Free quotes, competitive prices, and 5-year guarantee on all work.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Electrical Installation", description: "New circuits, sockets, lighting, and more for homes and businesses", icon: "zap" },
        { title: "Rewiring", description: "Full and partial rewires with minimal disruption", icon: "cable" },
        { title: "Fuse Box Upgrades", description: "Modern consumer unit installations for improved safety", icon: "shield" },
        { title: "EV Charger Installation", description: "Electric vehicle charging points installed at your home", icon: "battery-charging" },
        { title: "Emergency Callouts", description: "24/7 emergency electrical repairs when you need them", icon: "alert-circle" },
        { title: "Electrical Inspections", description: "EICR reports and safety certificates for landlords", icon: "clipboard-check" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Spark Electric?", content: "Spark Electric is a family-run electrical company serving Birmingham and the West Midlands. All our electricians are NICEIC registered and we guarantee all work for 5 years.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "David H.", description: "Had our entire house rewired. Clean work, excellent communication, and finished on time." },
        { title: "Lisa M.", description: "Quick response for an emergency. Fixed the problem same day at a fair price." },
        { title: "Paul T.", description: "Installed EV charger perfectly. Explained everything clearly. Very professional." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready to discuss your electrical needs? Call us on 0121 555 0456 or fill out the form below for a free quote.", visible: true },
      { id: "cta", type: "cta", title: "Need an Electrician?", content: "NICEIC registered. 5-year guarantee. Free quotes available.", visible: true }
    ]
  },
  builder: {
    businessName: "Thompson Construction",
    trade: "builder",
    location: "Leeds",
    phone: "0113 555 0789",
    services: ["House Extensions", "Loft Conversions", "New Builds", "Renovations", "Structural Work", "Project Management"],
    tagline: "Building dreams in Leeds for over 20 years",
    about: "Thompson Construction has been transforming homes across Yorkshire for over two decades. We're a full-service building company handling everything from planning applications to the finishing touches. Our team of skilled tradesmen take pride in every project, big or small.",
    colors: { primary: "#dc2626", secondary: "#fef2f2", accent: "#1f2937" },
    sections: [
      { id: "hero", type: "hero", title: "Quality Builders in Leeds", content: "Extensions, loft conversions, and renovations. From concept to completion, we handle it all.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "House Extensions", description: "Single and double storey extensions to expand your living space", icon: "home-plus" },
        { title: "Loft Conversions", description: "Transform your loft into valuable living space", icon: "arrow-up" },
        { title: "New Builds", description: "Complete new build projects from foundation to finish", icon: "building" },
        { title: "Renovations", description: "Full property renovations and refurbishments", icon: "hammer" },
        { title: "Structural Work", description: "Load-bearing wall removal, steelwork, and underpinning", icon: "columns" },
        { title: "Project Management", description: "End-to-end project management for stress-free builds", icon: "clipboard" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Thompson Construction?", content: "Thompson Construction has been transforming homes across Yorkshire for over two decades. We're a full-service building company handling everything from planning applications to the finishing touches.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Mark R.", description: "Our extension is incredible. The team were professional from start to finish." },
        { title: "Susan W.", description: "Loft conversion exceeded our expectations. Great communication throughout." },
        { title: "Andrew P.", description: "Third project with Thompson. Wouldn't use anyone else. Top quality work." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready to start your project? Call us on 0113 555 0789 or fill out the form below for a free consultation.", visible: true },
      { id: "cta", type: "cta", title: "Ready to Build?", content: "Free site surveys. Detailed quotes. 20+ years experience.", visible: true }
    ]
  },
  carpenter: {
    businessName: "Oak & Pine Joinery",
    trade: "carpenter",
    location: "Bristol",
    phone: "0117 555 0234",
    services: ["Bespoke Kitchens", "Fitted Wardrobes", "Staircases", "Doors & Windows", "Decking", "Restoration Work"],
    tagline: "Master craftsmen creating beautiful woodwork in Bristol",
    about: "Oak & Pine Joinery combines traditional craftsmanship with modern techniques to create stunning bespoke woodwork. From handcrafted kitchens to elegant staircases, we bring your vision to life using the finest materials and time-honoured skills passed down through generations.",
    colors: { primary: "#92400e", secondary: "#fef3c7", accent: "#15803d" },
    sections: [
      { id: "hero", type: "hero", title: "Bespoke Carpentry & Joinery in Bristol", content: "Handcrafted woodwork made to measure. Kitchens, wardrobes, staircases and more.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Bespoke Kitchens", description: "Custom-designed and handcrafted kitchen cabinets", icon: "utensils" },
        { title: "Fitted Wardrobes", description: "Made-to-measure wardrobes that maximise your space", icon: "cabinet" },
        { title: "Staircases", description: "Beautiful bespoke staircases in any style", icon: "stairs" },
        { title: "Doors & Windows", description: "Custom doors and window frames, including sash restoration", icon: "door-open" },
        { title: "Decking", description: "Outdoor decking and garden structures", icon: "tree" },
        { title: "Restoration Work", description: "Period property woodwork restoration", icon: "history" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Oak & Pine Joinery?", content: "Oak & Pine Joinery combines traditional craftsmanship with modern techniques to create stunning bespoke woodwork. We bring your vision to life using the finest materials.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Helen G.", description: "Our new kitchen is absolutely stunning. True craftsmen at work." },
        { title: "Michael F.", description: "The staircase is a work of art. Worth every penny." },
        { title: "Claire B.", description: "Restored our Victorian doors beautifully. Attention to detail is exceptional." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready to discuss your project? Call us on 0117 555 0234 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Need Bespoke Woodwork?", content: "Free design consultations. Quality materials. Master craftsmanship.", visible: true }
    ]
  },
  painter: {
    businessName: "Fresh Coat Decorating",
    trade: "painter",
    location: "Liverpool",
    phone: "0151 555 0567",
    services: ["Interior Painting", "Exterior Painting", "Wallpapering", "Commercial Painting", "Spray Painting", "Colour Consultation"],
    tagline: "Transforming spaces across Liverpool with precision and care",
    about: "Fresh Coat Decorating brings colour and life to homes and businesses across Merseyside. Our experienced decorators pay attention to every detail, from careful preparation to flawless finishes. We use only premium paints and materials for results that last.",
    colors: { primary: "#7c3aed", secondary: "#f5f3ff", accent: "#ec4899" },
    sections: [
      { id: "hero", type: "hero", title: "Professional Painters & Decorators in Liverpool", content: "Interior and exterior painting with immaculate finishes. Free quotes and colour advice.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Interior Painting", description: "Walls, ceilings, and woodwork painted to perfection", icon: "paint-bucket" },
        { title: "Exterior Painting", description: "Weather-resistant finishes for lasting kerb appeal", icon: "home" },
        { title: "Wallpapering", description: "Expert wallpaper hanging including feature walls", icon: "layers" },
        { title: "Commercial Painting", description: "Offices, shops, and commercial spaces", icon: "building-2" },
        { title: "Spray Painting", description: "Factory-smooth finishes for kitchens and furniture", icon: "spray-can" },
        { title: "Colour Consultation", description: "Expert advice on colours and finishes", icon: "palette" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Fresh Coat Decorating?", content: "Fresh Coat Decorating brings colour and life to homes and businesses across Merseyside. Our experienced decorators pay attention to every detail.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Jennifer L.", description: "Our whole house looks brand new. Neat, tidy workers and beautiful finish." },
        { title: "Tom H.", description: "The exterior painting has completely transformed our property." },
        { title: "Rachel D.", description: "Great colour advice and flawless wallpapering. Highly recommend." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready to refresh your space? Call us on 0151 555 0567 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Need a Fresh Coat?", content: "Free colour consultation. Premium materials. Spotless finishes.", visible: true }
    ]
  },
  roofer: {
    businessName: "Apex Roofing",
    trade: "roofer",
    location: "Sheffield",
    phone: "0114 555 0890",
    services: ["Roof Repairs", "Flat Roofing", "Tile Replacement", "Chimney Repairs", "Guttering", "Emergency Roof Repairs"],
    tagline: "Sheffield's most trusted roofing company - All work guaranteed",
    about: "Apex Roofing has been keeping Sheffield dry for over 25 years. From a single missing tile to complete roof replacements, our experienced team handles all roofing work with skill and care. We're fully insured, work at height certified, and guarantee all our work.",
    colors: { primary: "#0891b2", secondary: "#ecfeff", accent: "#f59e0b" },
    sections: [
      { id: "hero", type: "hero", title: "Expert Roofing Services in Sheffield", content: "Repairs, replacements, and maintenance. 25 years experience, fully insured, all work guaranteed.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Roof Repairs", description: "Fast, effective repairs for all roof types", icon: "tool" },
        { title: "Flat Roofing", description: "EPDM, GRP and felt flat roof installations", icon: "rectangle" },
        { title: "Tile Replacement", description: "Matching and replacing damaged tiles", icon: "grid" },
        { title: "Chimney Repairs", description: "Repointing, rebuilds, and lead work", icon: "home" },
        { title: "Guttering", description: "New gutters, repairs, and cleaning", icon: "droplets" },
        { title: "Emergency Repairs", description: "Rapid response for storm damage and leaks", icon: "alert-triangle" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Apex Roofing?", content: "Apex Roofing has been keeping Sheffield dry for over 25 years. We're fully insured, work at height certified, and guarantee all our work.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Graham T.", description: "Came out in a storm to fix our leaking roof. Can't thank them enough." },
        { title: "Wendy M.", description: "New flat roof is perfect. No more leaks and looks great too." },
        { title: "Chris P.", description: "Thorough, professional, and reasonably priced. Will use again." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Need a roof repair or quote? Call us on 0114 555 0890 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Roof Problems?", content: "Free roof inspections. No obligation quotes. 25 year experience.", visible: true }
    ]
  },
  landscaper: {
    businessName: "Green Thumb Gardens",
    trade: "landscaper",
    location: "Edinburgh",
    phone: "0131 555 0123",
    services: ["Garden Design", "Landscaping", "Paving & Patios", "Fencing", "Water Features", "Garden Maintenance"],
    tagline: "Creating outdoor living spaces across Edinburgh",
    about: "Green Thumb Gardens transforms outdoor spaces into beautiful, functional gardens. Whether you want a low-maintenance modern space or a traditional cottage garden, our designers and landscapers bring your vision to life. We've won multiple awards for our innovative garden designs.",
    colors: { primary: "#15803d", secondary: "#f0fdf4", accent: "#854d0e" },
    sections: [
      { id: "hero", type: "hero", title: "Award-Winning Landscaping in Edinburgh", content: "Garden design and landscaping that transforms your outdoor space into something special.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Garden Design", description: "Bespoke garden designs tailored to your lifestyle", icon: "pencil-ruler" },
        { title: "Landscaping", description: "Complete garden transformations and hard landscaping", icon: "trees" },
        { title: "Paving & Patios", description: "Natural stone, block paving, and porcelain", icon: "grid-3x3" },
        { title: "Fencing", description: "Timber fencing, gates, and boundary solutions", icon: "fence" },
        { title: "Water Features", description: "Ponds, fountains, and water gardens", icon: "waves" },
        { title: "Garden Maintenance", description: "Regular maintenance to keep your garden perfect", icon: "scissors" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Green Thumb Gardens?", content: "Green Thumb Gardens transforms outdoor spaces into beautiful, functional gardens. We've won multiple awards for our innovative garden designs.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Fiona M.", description: "Our garden is now our favourite room. Stunning design, perfect execution." },
        { title: "Ian K.", description: "The patio and landscaping have completely changed how we use our garden." },
        { title: "Margaret H.", description: "Maintenance service is excellent. Garden looks perfect all year round." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready to transform your garden? Call us on 0131 555 0123 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Dream Garden Awaits", content: "Free design consultations. Award-winning designs. Quality guaranteed.", visible: true }
    ]
  },
  plasterer: {
    businessName: "Smooth Finish Plastering",
    trade: "plasterer",
    location: "Glasgow",
    phone: "0141 555 0456",
    services: ["Plastering", "Rendering", "Skimming", "Coving & Cornices", "Artex Removal", "Dry Lining"],
    tagline: "Flawless plastering in Glasgow and beyond",
    about: "Smooth Finish Plastering provides exceptional plastering services across Glasgow and Central Scotland. With over 20 years of experience, we deliver perfect finishes every time. From small patch repairs to complete re-plastering, we take pride in our craft and leave every job spotless.",
    colors: { primary: "#64748b", secondary: "#f8fafc", accent: "#0ea5e9" },
    sections: [
      { id: "hero", type: "hero", title: "Professional Plastering in Glasgow", content: "Smooth, perfect finishes on every job. 20 years experience, competitive prices.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Plastering", description: "Traditional sand and cement plastering", icon: "brush" },
        { title: "Rendering", description: "External rendering in all styles and finishes", icon: "home" },
        { title: "Skimming", description: "Perfect skim finishes on walls and ceilings", icon: "layers" },
        { title: "Coving & Cornices", description: "Decorative coving and cornice fitting", icon: "corner-right-up" },
        { title: "Artex Removal", description: "Safe removal of textured ceilings", icon: "eraser" },
        { title: "Dry Lining", description: "Plasterboard installation and finishing", icon: "layout" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Smooth Finish Plastering?", content: "Smooth Finish Plastering provides exceptional plastering services across Glasgow and Central Scotland. With over 20 years of experience, we deliver perfect finishes every time.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Scott M.", description: "The walls are absolutely perfect. Best plasterer we've ever used." },
        { title: "Linda T.", description: "Artex removal was clean and the new finish is flawless." },
        { title: "Derek W.", description: "Exterior rendering looks fantastic. Transformed our house." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Need a plasterer? Call us on 0141 555 0456 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Need Perfect Walls?", content: "Free quotes. 20 years experience. Immaculate finishes.", visible: true }
    ]
  },
  tiler: {
    businessName: "Precision Tiling",
    trade: "tiler",
    location: "Cardiff",
    phone: "029 555 0789",
    services: ["Bathroom Tiling", "Kitchen Splashbacks", "Floor Tiling", "Mosaic Work", "Underfloor Heating", "Natural Stone"],
    tagline: "Expert tiling services throughout Cardiff and South Wales",
    about: "Precision Tiling delivers exceptional tiling work across Cardiff and South Wales. We specialise in creating stunning bathrooms and kitchens with meticulous attention to detail. From porcelain to natural stone, we work with all tile types to achieve perfect results.",
    colors: { primary: "#0d9488", secondary: "#f0fdfa", accent: "#fbbf24" },
    sections: [
      { id: "hero", type: "hero", title: "Professional Tiling in Cardiff", content: "Beautiful bathrooms and kitchens with precision tiling. Free quotes, expert advice.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Bathroom Tiling", description: "Complete bathroom tiling including wet rooms", icon: "bath" },
        { title: "Kitchen Splashbacks", description: "Stylish splashbacks in any material", icon: "chef-hat" },
        { title: "Floor Tiling", description: "Durable floor tiling for any room", icon: "grid-3x3" },
        { title: "Mosaic Work", description: "Intricate mosaic designs and patterns", icon: "grid-2x2" },
        { title: "Underfloor Heating", description: "Electric underfloor heating installation", icon: "thermometer" },
        { title: "Natural Stone", description: "Marble, slate, and travertine specialists", icon: "mountain" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Precision Tiling?", content: "Precision Tiling delivers exceptional tiling work across Cardiff and South Wales. We specialise in creating stunning bathrooms and kitchens with meticulous attention to detail.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Rhys D.", description: "Our bathroom looks like a five-star hotel. Incredible attention to detail." },
        { title: "Gemma L.", description: "The kitchen floor is perfect. Not a single lippage anywhere." },
        { title: "Owen P.", description: "Underfloor heating and tiling done in one go. Excellent service." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready for beautiful tiles? Call us on 029 555 0789 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Need a Tiler?", content: "Free consultations. Premium tiles. Precision fitting.", visible: true }
    ]
  },
  locksmith: {
    businessName: "SecureLock Services",
    trade: "locksmith",
    location: "Newcastle",
    phone: "0191 555 0234",
    services: ["Emergency Lockouts", "Lock Replacement", "Key Cutting", "Security Upgrades", "UPVC Lock Repairs", "Safe Opening"],
    tagline: "24/7 emergency locksmith in Newcastle - Fast response guaranteed",
    about: "SecureLock Services provides rapid-response locksmith services across Newcastle and the North East. We're available 24 hours a day, 7 days a week for emergencies. Our DBS-checked locksmiths are fully trained in the latest lock technologies and security systems.",
    colors: { primary: "#1e40af", secondary: "#eff6ff", accent: "#dc2626" },
    sections: [
      { id: "hero", type: "hero", title: "24/7 Emergency Locksmith in Newcastle", content: "Locked out? We'll be there in 30 minutes or less. No call-out fee, competitive prices.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Emergency Lockouts", description: "Locked out? We'll get you back in fast", icon: "key" },
        { title: "Lock Replacement", description: "All lock types supplied and fitted", icon: "lock" },
        { title: "Key Cutting", description: "Keys cut on-site, including security keys", icon: "scissors" },
        { title: "Security Upgrades", description: "Improve your home security with modern locks", icon: "shield" },
        { title: "UPVC Lock Repairs", description: "Specialist UPVC door and window locks", icon: "door-open" },
        { title: "Safe Opening", description: "Non-destructive safe opening", icon: "box" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose SecureLock Services?", content: "SecureLock Services provides rapid-response locksmith services across Newcastle. We're available 24 hours a day, 7 days a week. All our locksmiths are DBS-checked.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Sophie R.", description: "Locked out at midnight. They came in 20 minutes. Lifesaver!" },
        { title: "Kevin B.", description: "Upgraded all our locks after a break-in. Feel much safer now." },
        { title: "Anne C.", description: "Fixed our UPVC lock that others said couldn't be repaired. Great service." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Need a locksmith? Call us on 0191 555 0234 - we're available 24/7.", visible: true },
      { id: "cta", type: "cta", title: "Locked Out?", content: "30 minute response. No call-out fee. Available 24/7.", visible: true }
    ]
  },
  handyman: {
    businessName: "Fix-It-All Services",
    trade: "handyman",
    location: "Nottingham",
    phone: "0115 555 0567",
    services: ["General Repairs", "Flat Pack Assembly", "Hanging & Mounting", "Minor Plumbing", "Minor Electrical", "Property Maintenance"],
    tagline: "No job too small - Nottingham's reliable handyman service",
    about: "Fix-It-All Services takes care of all those jobs you never get around to. From hanging pictures to assembling furniture, fixing leaky taps to patching walls, we handle it all efficiently and affordably. Save your weekends - let us do the odd jobs.",
    colors: { primary: "#ea580c", secondary: "#fff7ed", accent: "#16a34a" },
    sections: [
      { id: "hero", type: "hero", title: "Reliable Handyman Services in Nottingham", content: "No job too small. One call for all your household repairs and odd jobs.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "General Repairs", description: "All household repairs, big and small", icon: "wrench" },
        { title: "Flat Pack Assembly", description: "IKEA and all flat pack furniture assembled", icon: "package" },
        { title: "Hanging & Mounting", description: "TVs, mirrors, shelves, and pictures hung safely", icon: "monitor" },
        { title: "Minor Plumbing", description: "Leaky taps, toilet repairs, and basic plumbing", icon: "droplet" },
        { title: "Minor Electrical", description: "Light fitting, socket replacements, and more", icon: "lightbulb" },
        { title: "Property Maintenance", description: "Regular maintenance for landlords and businesses", icon: "building" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Fix-It-All Services?", content: "Fix-It-All Services takes care of all those jobs you never get around to. Save your weekends - let us do the odd jobs.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Janet P.", description: "Finally got my to-do list done! Professional and friendly service." },
        { title: "Steve M.", description: "Assembled a nightmare IKEA wardrobe perfectly. Worth every penny." },
        { title: "Carol K.", description: "Regular maintenance visits keep my rental properties in top shape." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Got a job that needs doing? Call us on 0115 555 0567 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Need a Handyman?", content: "No job too small. Flexible scheduling. Competitive hourly rates.", visible: true }
    ]
  },
  cleaner: {
    businessName: "Crystal Clear Cleaning",
    trade: "cleaner",
    location: "Leicester",
    phone: "0116 555 0890",
    services: ["Domestic Cleaning", "Commercial Cleaning", "End of Tenancy", "Deep Cleaning", "Carpet Cleaning", "Window Cleaning"],
    tagline: "Professional cleaning services across Leicester",
    about: "Crystal Clear Cleaning delivers spotless results for homes and businesses across Leicester and Leicestershire. Our trained, vetted cleaners use eco-friendly products and pay attention to every detail. Regular cleans, one-offs, and end of tenancy services available.",
    colors: { primary: "#0284c7", secondary: "#f0f9ff", accent: "#10b981" },
    sections: [
      { id: "hero", type: "hero", title: "Professional Cleaning Services in Leicester", content: "Homes and businesses left spotless. Vetted cleaners, eco-friendly products, flexible scheduling.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Domestic Cleaning", description: "Regular home cleaning tailored to you", icon: "home" },
        { title: "Commercial Cleaning", description: "Offices, shops, and business premises", icon: "building" },
        { title: "End of Tenancy", description: "Thorough cleaning to get your deposit back", icon: "key" },
        { title: "Deep Cleaning", description: "Intensive cleaning for that fresh start", icon: "sparkles" },
        { title: "Carpet Cleaning", description: "Professional carpet and upholstery cleaning", icon: "square" },
        { title: "Window Cleaning", description: "Crystal clear windows inside and out", icon: "eye" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Crystal Clear Cleaning?", content: "Crystal Clear Cleaning delivers spotless results for homes and businesses across Leicester. Our trained, vetted cleaners use eco-friendly products and pay attention to every detail.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Priya S.", description: "Weekly cleaning service is brilliant. Come home to a perfect house." },
        { title: "Marcus J.", description: "End of tenancy clean got our full deposit back. Amazing job." },
        { title: "Office Manager", description: "Our office has never been cleaner. Very reliable team." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready for a cleaner home or office? Call us on 0116 555 0890 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Need a Cleaner?", content: "Vetted cleaners. Eco-friendly products. Satisfaction guaranteed.", visible: true }
    ]
  },
  gardener: {
    businessName: "Blooming Lovely Gardens",
    trade: "gardener",
    location: "Oxford",
    phone: "01865 555 012",
    services: ["Lawn Care", "Hedge Trimming", "Planting", "Garden Clearance", "Tree Surgery", "Regular Maintenance"],
    tagline: "Keeping Oxford's gardens beautiful all year round",
    about: "Blooming Lovely Gardens offers expert garden maintenance and care throughout Oxford and Oxfordshire. From weekly lawn mowing to complete garden makeovers, our passionate team keeps your outdoor space looking its best in every season.",
    colors: { primary: "#65a30d", secondary: "#f7fee7", accent: "#be185d" },
    sections: [
      { id: "hero", type: "hero", title: "Expert Garden Care in Oxford", content: "Regular maintenance, one-off jobs, and garden transformations. Beautiful gardens guaranteed.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Lawn Care", description: "Mowing, edging, feeding, and treatments", icon: "grass" },
        { title: "Hedge Trimming", description: "All hedges trimmed to perfection", icon: "scissors" },
        { title: "Planting", description: "Seasonal planting and garden design", icon: "flower" },
        { title: "Garden Clearance", description: "Overgrown gardens cleared and restored", icon: "trash" },
        { title: "Tree Surgery", description: "Tree pruning, felling, and stump removal", icon: "tree-pine" },
        { title: "Regular Maintenance", description: "Weekly, fortnightly, or monthly visits", icon: "calendar" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Blooming Lovely Gardens?", content: "Blooming Lovely Gardens offers expert garden maintenance and care throughout Oxford. Our passionate team keeps your outdoor space looking its best in every season.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Elizabeth R.", description: "My garden has never looked better. Worth every penny for the peace of mind." },
        { title: "Richard H.", description: "Cleared an overgrown jungle and turned it into a lovely garden." },
        { title: "Mary T.", description: "Reliable weekly visits. Always do a thorough job." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Ready for a beautiful garden? Call us on 01865 555 012 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Garden Need Attention?", content: "Free quotes. Flexible scheduling. All green waste removed.", visible: true }
    ]
  },
  "pest-control": {
    businessName: "Critter Control UK",
    trade: "pest-control",
    location: "Cambridge",
    phone: "01223 555 034",
    services: ["Rodent Control", "Insect Removal", "Bird Proofing", "Wasp Nest Removal", "Wildlife Management", "Commercial Contracts"],
    tagline: "Fast, discreet pest control across Cambridge",
    about: "Critter Control UK provides fast, effective, and humane pest control services throughout Cambridge and the surrounding areas. Our BPCA-qualified technicians use the latest methods to solve your pest problems quickly and discreetly, with follow-up visits to ensure complete eradication.",
    colors: { primary: "#4f46e5", secondary: "#eef2ff", accent: "#f97316" },
    sections: [
      { id: "hero", type: "hero", title: "Professional Pest Control in Cambridge", content: "Fast response, discreet service, complete eradication. BPCA qualified technicians.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Rodent Control", description: "Mice and rat removal with prevention advice", icon: "bug" },
        { title: "Insect Removal", description: "Cockroaches, bed bugs, fleas, and more", icon: "bug-off" },
        { title: "Bird Proofing", description: "Humane bird deterrents and proofing", icon: "bird" },
        { title: "Wasp Nest Removal", description: "Safe removal of wasp and bee nests", icon: "alert-triangle" },
        { title: "Wildlife Management", description: "Foxes, squirrels, and other wildlife", icon: "paw-print" },
        { title: "Commercial Contracts", description: "Regular pest control for businesses", icon: "building-2" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Critter Control UK?", content: "Critter Control UK provides fast, effective, and humane pest control services throughout Cambridge. Our BPCA-qualified technicians use the latest methods.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Restaurant Owner", description: "Discrete, professional service. No more pest problems." },
        { title: "George L.", description: "Got rid of our mouse problem completely. Very thorough." },
        { title: "Amanda W.", description: "Removed a wasp nest same day. Quick and safe service." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Got a pest problem? Call us on 01223 555 034 for a fast response.", visible: true },
      { id: "cta", type: "cta", title: "Pest Problem?", content: "Same day service available. Discreet visits. Guaranteed results.", visible: true }
    ]
  },
  hvac: {
    businessName: "Climate Comfort Heating",
    trade: "hvac",
    location: "Southampton",
    phone: "023 555 0567",
    services: ["Boiler Installation", "Air Conditioning", "Heating Repairs", "Heat Pumps", "Ventilation Systems", "Annual Servicing"],
    tagline: "Year-round comfort for homes and businesses in Southampton",
    about: "Climate Comfort Heating keeps Southampton comfortable all year round. Whether you need a new boiler, air conditioning for summer, or a cutting-edge heat pump, our Gas Safe and F-Gas certified engineers deliver quality installations and repairs with full manufacturer warranties.",
    colors: { primary: "#dc2626", secondary: "#fef2f2", accent: "#2563eb" },
    sections: [
      { id: "hero", type: "hero", title: "Heating & Cooling Experts in Southampton", content: "Boilers, air con, and heat pumps. Gas Safe and F-Gas certified. 10 year warranties available.", visible: true },
      { id: "services", type: "services", title: "Our Services", items: [
        { title: "Boiler Installation", description: "New boilers from leading manufacturers", icon: "flame" },
        { title: "Air Conditioning", description: "Home and office air con installation", icon: "wind" },
        { title: "Heating Repairs", description: "Fast repairs for all heating systems", icon: "wrench" },
        { title: "Heat Pumps", description: "Air and ground source heat pumps", icon: "leaf" },
        { title: "Ventilation Systems", description: "MVHR and extraction systems", icon: "fan" },
        { title: "Annual Servicing", description: "Keep your systems running efficiently", icon: "calendar-check" }
      ], visible: true },
      { id: "about", type: "about", title: "Why Choose Climate Comfort Heating?", content: "Climate Comfort Heating keeps Southampton comfortable all year round. Our Gas Safe and F-Gas certified engineers deliver quality installations and repairs.", visible: true },
      { id: "testimonials", type: "testimonials", title: "What Our Customers Say", items: [
        { title: "Business Owner", description: "Air con in our office has been a game changer. Excellent installation." },
        { title: "Peter N.", description: "New boiler installed in a day. Much lower energy bills now." },
        { title: "Christine D.", description: "Heat pump is working brilliantly. Great advice on the right system." }
      ], visible: true },
      { id: "contact", type: "contact", title: "Get In Touch", content: "Need heating or cooling solutions? Call us on 023 555 0567 or fill out the form below.", visible: true },
      { id: "cta", type: "cta", title: "Need Climate Control?", content: "Free surveys. 10 year warranties. Gas Safe registered.", visible: true }
    ]
  }
};

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tradevista',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  });

  try {
    for (const [slug, config] of Object.entries(demoConfigs)) {
      const jsonConfig = JSON.stringify(config);
      await connection.execute(
        'UPDATE trade_categories SET demo_site_config = ? WHERE slug = ?',
        [jsonConfig, slug]
      );
      console.log(`Updated demo config for: ${slug}`);
    }
    console.log('\nAll demo configs saved successfully!');

    // Verify
    const [rows] = await connection.execute('SELECT slug, JSON_VALID(demo_site_config) as valid FROM trade_categories');
    console.log('\nValidation:');
    for (const row of rows) {
      console.log(`  ${row.slug}: ${row.valid ? 'Valid JSON' : 'Invalid JSON'}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

main();
