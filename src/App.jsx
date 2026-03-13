import { useState, useEffect } from "react";
import theme from './theme.js'
import './App.css'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// ─── Airports Data (120+ World Airports) ─────────────────────────────────────
const AIRPORTS = [
  { code:"LHE", name:"Allama Iqbal International Airport",       city:"Lahore",            country:"Pakistan" },
  { code:"KHI", name:"Jinnah International Airport",            city:"Karachi",           country:"Pakistan" },
  { code:"ISB", name:"New Islamabad International Airport",      city:"Islamabad",         country:"Pakistan" },
  { code:"PEW", name:"Bacha Khan International Airport",        city:"Peshawar",          country:"Pakistan" },
  { code:"SKT", name:"Sialkot International Airport",           city:"Sialkot",           country:"Pakistan" },
  { code:"MUX", name:"Multan International Airport",            city:"Multan",            country:"Pakistan" },
  { code:"UET", name:"Quetta International Airport",            city:"Quetta",            country:"Pakistan" },
  { code:"DXB", name:"Dubai International Airport",             city:"Dubai",             country:"UAE" },
  { code:"AUH", name:"Abu Dhabi International Airport",         city:"Abu Dhabi",         country:"UAE" },
  { code:"SHJ", name:"Sharjah International Airport",           city:"Sharjah",           country:"UAE" },
  { code:"DOH", name:"Hamad International Airport",             city:"Doha",              country:"Qatar" },
  { code:"RUH", name:"King Khalid International Airport",       city:"Riyadh",            country:"Saudi Arabia" },
  { code:"JED", name:"King Abdulaziz International Airport",    city:"Jeddah",            country:"Saudi Arabia" },
  { code:"MED", name:"Prince Mohammad Bin Abdulaziz Airport",   city:"Madinah",           country:"Saudi Arabia" },
  { code:"DMM", name:"King Fahd International Airport",         city:"Dammam",            country:"Saudi Arabia" },
  { code:"BAH", name:"Bahrain International Airport",           city:"Manama",            country:"Bahrain" },
  { code:"KWI", name:"Kuwait International Airport",            city:"Kuwait City",       country:"Kuwait" },
  { code:"MCT", name:"Muscat International Airport",            city:"Muscat",            country:"Oman" },
  { code:"AMM", name:"Queen Alia International Airport",        city:"Amman",             country:"Jordan" },
  { code:"CAI", name:"Cairo International Airport",             city:"Cairo",             country:"Egypt" },
  { code:"IST", name:"Istanbul Airport",                        city:"Istanbul",          country:"Turkey" },
  { code:"SAW", name:"Sabiha Gokcen International Airport",     city:"Istanbul",          country:"Turkey" },
  { code:"ESB", name:"Esenboga International Airport",          city:"Ankara",            country:"Turkey" },
  { code:"DEL", name:"Indira Gandhi International Airport",     city:"New Delhi",         country:"India" },
  { code:"BOM", name:"Chhatrapati Shivaji International Airport",city:"Mumbai",           country:"India" },
  { code:"BLR", name:"Kempegowda International Airport",        city:"Bengaluru",         country:"India" },
  { code:"HYD", name:"Rajiv Gandhi International Airport",      city:"Hyderabad",         country:"India" },
  { code:"MAA", name:"Chennai International Airport",           city:"Chennai",           country:"India" },
  { code:"CCU", name:"Netaji Subhas Chandra Bose Intl Airport", city:"Kolkata",           country:"India" },
  { code:"DAC", name:"Hazrat Shahjalal International Airport",  city:"Dhaka",             country:"Bangladesh" },
  { code:"CMB", name:"Bandaranaike International Airport",      city:"Colombo",           country:"Sri Lanka" },
  { code:"KTM", name:"Tribhuvan International Airport",         city:"Kathmandu",         country:"Nepal" },
  { code:"KUL", name:"Kuala Lumpur International Airport",      city:"Kuala Lumpur",      country:"Malaysia" },
  { code:"SIN", name:"Singapore Changi Airport",                city:"Singapore",         country:"Singapore" },
  { code:"CGK", name:"Soekarno-Hatta International Airport",    city:"Jakarta",           country:"Indonesia" },
  { code:"DPS", name:"Ngurah Rai International Airport",        city:"Bali",              country:"Indonesia" },
  { code:"BKK", name:"Suvarnabhumi Airport",                    city:"Bangkok",           country:"Thailand" },
  { code:"MNL", name:"Ninoy Aquino International Airport",      city:"Manila",            country:"Philippines" },
  { code:"HAN", name:"Noi Bai International Airport",           city:"Hanoi",             country:"Vietnam" },
  { code:"SGN", name:"Tan Son Nhat International Airport",      city:"Ho Chi Minh City",  country:"Vietnam" },
  { code:"HKG", name:"Hong Kong International Airport",         city:"Hong Kong",         country:"China" },
  { code:"PEK", name:"Beijing Capital International Airport",   city:"Beijing",           country:"China" },
  { code:"PVG", name:"Shanghai Pudong International Airport",   city:"Shanghai",          country:"China" },
  { code:"CAN", name:"Guangzhou Baiyun International Airport",  city:"Guangzhou",         country:"China" },
  { code:"ICN", name:"Incheon International Airport",           city:"Seoul",             country:"South Korea" },
  { code:"NRT", name:"Narita International Airport",            city:"Tokyo",             country:"Japan" },
  { code:"HND", name:"Haneda Airport",                          city:"Tokyo",             country:"Japan" },
  { code:"KIX", name:"Kansai International Airport",            city:"Osaka",             country:"Japan" },
  { code:"SYD", name:"Sydney Kingsford Smith Airport",          city:"Sydney",            country:"Australia" },
  { code:"MEL", name:"Melbourne Airport",                       city:"Melbourne",         country:"Australia" },
  { code:"BNE", name:"Brisbane Airport",                        city:"Brisbane",          country:"Australia" },
  { code:"PER", name:"Perth Airport",                           city:"Perth",             country:"Australia" },
  { code:"AKL", name:"Auckland Airport",                        city:"Auckland",          country:"New Zealand" },
  { code:"LHR", name:"Heathrow Airport",                        city:"London",            country:"United Kingdom" },
  { code:"LGW", name:"Gatwick Airport",                         city:"London",            country:"United Kingdom" },
  { code:"MAN", name:"Manchester Airport",                      city:"Manchester",        country:"United Kingdom" },
  { code:"BHX", name:"Birmingham Airport",                      city:"Birmingham",        country:"United Kingdom" },
  { code:"EDI", name:"Edinburgh Airport",                       city:"Edinburgh",         country:"United Kingdom" },
  { code:"CDG", name:"Charles de Gaulle Airport",               city:"Paris",             country:"France" },
  { code:"ORY", name:"Orly Airport",                            city:"Paris",             country:"France" },
  { code:"NCE", name:"Nice Cote d'Azur Airport",               city:"Nice",              country:"France" },
  { code:"FRA", name:"Frankfurt Airport",                       city:"Frankfurt",         country:"Germany" },
  { code:"MUC", name:"Munich Airport",                          city:"Munich",            country:"Germany" },
  { code:"BER", name:"Berlin Brandenburg Airport",              city:"Berlin",            country:"Germany" },
  { code:"AMS", name:"Amsterdam Schiphol Airport",              city:"Amsterdam",         country:"Netherlands" },
  { code:"BRU", name:"Brussels Airport",                        city:"Brussels",          country:"Belgium" },
  { code:"ZRH", name:"Zurich Airport",                          city:"Zurich",            country:"Switzerland" },
  { code:"GVA", name:"Geneva Airport",                          city:"Geneva",            country:"Switzerland" },
  { code:"VIE", name:"Vienna International Airport",            city:"Vienna",            country:"Austria" },
  { code:"FCO", name:"Leonardo da Vinci International Airport", city:"Rome",              country:"Italy" },
  { code:"MXP", name:"Milan Malpensa Airport",                  city:"Milan",             country:"Italy" },
  { code:"MAD", name:"Adolfo Suarez Madrid Barajas Airport",    city:"Madrid",            country:"Spain" },
  { code:"BCN", name:"Barcelona El Prat Airport",               city:"Barcelona",         country:"Spain" },
  { code:"LIS", name:"Humberto Delgado Airport",                city:"Lisbon",            country:"Portugal" },
  { code:"ATH", name:"Athens International Airport",            city:"Athens",            country:"Greece" },
  { code:"WAW", name:"Warsaw Chopin Airport",                   city:"Warsaw",            country:"Poland" },
  { code:"PRG", name:"Vaclav Havel Airport Prague",             city:"Prague",            country:"Czech Republic" },
  { code:"BUD", name:"Budapest Ferenc Liszt International",     city:"Budapest",          country:"Hungary" },
  { code:"SVO", name:"Sheremetyevo International Airport",      city:"Moscow",            country:"Russia" },
  { code:"JFK", name:"John F. Kennedy International Airport",   city:"New York",          country:"USA" },
  { code:"EWR", name:"Newark Liberty International Airport",    city:"New York",          country:"USA" },
  { code:"LAX", name:"Los Angeles International Airport",       city:"Los Angeles",       country:"USA" },
  { code:"ORD", name:"O'Hare International Airport",            city:"Chicago",           country:"USA" },
  { code:"DFW", name:"Dallas/Fort Worth International Airport", city:"Dallas",            country:"USA" },
  { code:"ATL", name:"Hartsfield-Jackson Atlanta Intl Airport", city:"Atlanta",           country:"USA" },
  { code:"IAD", name:"Washington Dulles International Airport", city:"Washington D.C.",   country:"USA" },
  { code:"MIA", name:"Miami International Airport",             city:"Miami",             country:"USA" },
  { code:"SFO", name:"San Francisco International Airport",     city:"San Francisco",     country:"USA" },
  { code:"BOS", name:"Logan International Airport",             city:"Boston",            country:"USA" },
  { code:"SEA", name:"Seattle-Tacoma International Airport",    city:"Seattle",           country:"USA" },
  { code:"LAS", name:"Harry Reid International Airport",        city:"Las Vegas",         country:"USA" },
  { code:"DEN", name:"Denver International Airport",            city:"Denver",            country:"USA" },
  { code:"IAH", name:"George Bush Intercontinental Airport",    city:"Houston",           country:"USA" },
  { code:"YYZ", name:"Toronto Pearson International Airport",   city:"Toronto",           country:"Canada" },
  { code:"YVR", name:"Vancouver International Airport",         city:"Vancouver",         country:"Canada" },
  { code:"YUL", name:"Montreal Trudeau International Airport",  city:"Montreal",          country:"Canada" },
  { code:"GRU", name:"Sao Paulo Guarulhos International",       city:"Sao Paulo",         country:"Brazil" },
  { code:"GIG", name:"Rio de Janeiro Galeao International",     city:"Rio de Janeiro",    country:"Brazil" },
  { code:"EZE", name:"Ministro Pistarini International Airport",city:"Buenos Aires",      country:"Argentina" },
  { code:"BOG", name:"El Dorado International Airport",         city:"Bogota",            country:"Colombia" },
  { code:"LIM", name:"Jorge Chavez International Airport",      city:"Lima",              country:"Peru" },
  { code:"SCL", name:"Arturo Merino Benitez International",     city:"Santiago",          country:"Chile" },
  { code:"MEX", name:"Benito Juarez International Airport",     city:"Mexico City",       country:"Mexico" },
  { code:"CUN", name:"Cancun International Airport",            city:"Cancun",            country:"Mexico" },
  { code:"NBO", name:"Jomo Kenyatta International Airport",     city:"Nairobi",           country:"Kenya" },
  { code:"ADD", name:"Addis Ababa Bole International Airport",  city:"Addis Ababa",       country:"Ethiopia" },
  { code:"LOS", name:"Murtala Muhammed International Airport",  city:"Lagos",             country:"Nigeria" },
  { code:"JNB", name:"O.R. Tambo International Airport",        city:"Johannesburg",      country:"South Africa" },
  { code:"CPT", name:"Cape Town International Airport",         city:"Cape Town",         country:"South Africa" },
  { code:"CMN", name:"Mohammed V International Airport",        city:"Casablanca",        country:"Morocco" },
  { code:"TUN", name:"Tunis-Carthage International Airport",    city:"Tunis",             country:"Tunisia" },
  { code:"ALG", name:"Houari Boumediene Airport",               city:"Algiers",           country:"Algeria" },
  { code:"MLE", name:"Velana International Airport",            city:"Male",              country:"Maldives" },
  { code:"GYD", name:"Heydar Aliyev International Airport",     city:"Baku",              country:"Azerbaijan" },
  { code:"TBS", name:"Tbilisi International Airport",           city:"Tbilisi",           country:"Georgia" },
  { code:"ALA", name:"Almaty International Airport",            city:"Almaty",            country:"Kazakhstan" },
  { code:"TAS", name:"Tashkent International Airport",          city:"Tashkent",          country:"Uzbekistan" },
  { code:"EVN", name:"Zvartnots International Airport",         city:"Yerevan",           country:"Armenia" },
  { code:"DUB", name:"Dublin Airport",                          city:"Dublin",            country:"Ireland" },
  { code:"CPH", name:"Copenhagen Airport",                      city:"Copenhagen",        country:"Denmark" },
  { code:"ARN", name:"Stockholm Arlanda Airport",               city:"Stockholm",         country:"Sweden" },
  { code:"OSL", name:"Oslo Gardermoen Airport",                 city:"Oslo",              country:"Norway" },
  { code:"HEL", name:"Helsinki Airport",                        city:"Helsinki",          country:"Finland" },
  { code:"BEY", name:"Beirut Rafic Hariri International",       city:"Beirut",            country:"Lebanon" },
  { code:"KBL", name:"Hamid Karzai International Airport",      city:"Kabul",             country:"Afghanistan" },
  { code:"BGW", name:"Baghdad International Airport",           city:"Baghdad",           country:"Iraq" },
  { code:"TRV", name:"Trivandrum International Airport",        city:"Thiruvananthapuram", country:"India" },
  { code:"COK", name:"Cochin International Airport",            city:"Kochi",             country:"India" },
  { code:"AMD", name:"Sardar Vallabhbhai Patel Intl Airport",   city:"Ahmedabad",         country:"India" },
  { code:"PNQ", name:"Pune Airport",                            city:"Pune",              country:"India" },
];

// ─── App Data ─────────────────────────────────────────────────────────────────
const umrahPackages = [
  { id:1, name:"Economy Umrah Package",  category:"Economy",  img:"https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=600&q=80",  price:"PKR 195,000", rating:"4.8", reviews:"1.2k", tag:"Best Value",     days:"15 Days" },
  { id:2, name:"Standard Umrah Package", category:"Standard", img:"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",  price:"PKR 280,000", rating:"4.9", reviews:"2.4k", tag:"Popular",        days:"21 Days" },
  { id:3, name:"Premium Umrah Package",  category:"Premium",  img:"https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&q=80",  price:"PKR 420,000", rating:"5.0", reviews:"980",  tag:"Recommended",    days:"14 Days" },
  { id:4, name:"Luxury Umrah Package",   category:"Luxury",   img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",  price:"PKR 650,000", rating:"5.0", reviews:"540",  tag:"Exclusive",      days:"18 Days" },
  { id:5, name:"Family Umrah Package",   category:"Family",   img:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",  price:"PKR 520,000", rating:"4.9", reviews:"760",  tag:"Family Special",  days:"20 Days" },
  { id:6, name:"Group Umrah Package",    category:"Economy",  img:"https://images.unsplash.com/photo-1516571137133-b5d1a6f14e96?w=600&q=80",  price:"PKR 175,000", rating:"4.7", reviews:"1.8k", tag:"Group Deal",     days:"12 Days" },
];

const features = [
  { icon:"🛡️", title:"Safe & Secure",          desc:"100% verified tour packages with full insurance coverage and 24/7 support." },
  { icon:"💎", title:"Premium Quality",         desc:"Hand-picked 5-star hotels, private transfers and exclusive experiences." },
  { icon:"🗺️", title:"Expert Guides",           desc:"Local certified guides who know every hidden gem of the destination." },
  { icon:"💳", title:"Easy Payment",             desc:"Flexible payment plans with zero-cost EMI and multiple currency support." },
  { icon:"✈️", title:"Best Price Guarantee",    desc:"We match any lower price you find, or refund the difference." },
  { icon:"🔔", title:"Instant Booking",          desc:"Confirm your trip in minutes with instant hotel & flight booking." },
];

const reviews = [
  { name:"Salman Naseer", loc:"Lahore, Pakistan",    rating:5, text:"Absolutely magical experience! The Umrah trip was perfectly organized. Every tiny detail was taken care of, and the guide was phenomenal.", img:"https://i.pravatar.cc/60?img=47", tour:"Economy Umrah Package" },
  { name:"Faizan Mughal",  loc:"Islamabad, Pakistan", rating:5, text:"The hotel was right next to Haram — everything exceeded expectations. The entire process was smooth and well-organized from start to finish!", img:"https://i.pravatar.cc/60?img=12", tour:"Standard Umrah Package" },
  { name:"Bilal Mughal",   loc:"Islamabad, Pakistan", rating:5, text:"Chose the Premium package — 5-star hotel, private transport and dedicated guide. The best trip of my life. Would recommend 10 out of 10!", img:"https://i.pravatar.cc/60?img=33", tour:"Premium Umrah Package" },
];

const visasList = [
  { id:1, country:"Malaysia",     flag:"🇲🇾", img:"https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80", type:"Tourist",         processing:"3-5 Days",  fee:"PKR 8,500",  approvalRate:"99%" },
  { id:2, country:"UAE (Dubai)",  flag:"🇦🇪", img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", type:"Tourist",         processing:"2-4 Days",  fee:"PKR 22,000", approvalRate:"98%" },
  { id:3, country:"Turkey",       flag:"🇹🇷", img:"https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", type:"e-Visa",          processing:"1-3 Days",  fee:"PKR 12,000", approvalRate:"97%" },
  { id:4, country:"Maldives",     flag:"🇲🇻", img:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", type:"Visa On Arrival", processing:"On Arrival",fee:"FREE",       approvalRate:"100%" },
  { id:5, country:"Azerbaijan",   flag:"🇦🇿", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", type:"e-Visa",          processing:"3 Days",    fee:"PKR 9,500",  approvalRate:"98%" },
  { id:6, country:"Saudi Arabia", flag:"🇸🇦", img:"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",type:"Tourist / Umrah", processing:"7-10 Days", fee:"PKR 28,000", approvalRate:"96%" },
];

const carRentalHighlights = [
  { id:1, name:"Toyota Corolla",     company:"Toyota", type:"Sedan",       seats:4,  img:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80", price:"PKR 8,000",  tag:"Most Popular" },
  { id:2, name:"Toyota Fortuner",    company:"Toyota", type:"SUV",         seats:6,  img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80", price:"PKR 22,000", tag:"Luxury SUV" },
  { id:3, name:"Toyota Coaster",     company:"Toyota", type:"Coaster",     seats:28, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", price:"PKR 35,000", tag:"Group Travel" },
  { id:4, name:"Honda Civic",        company:"Honda",  type:"Sedan",       seats:4,  img:"https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80", price:"PKR 9,500",  tag:"Premium" },
  { id:5, name:"KIA Sportage",       company:"KIA",    type:"SUV",         seats:6,  img:"https://images.unsplash.com/photo-1580711508375-56e8c39e8d7d?w=600&q=80", price:"PKR 16,000", tag:"Modern SUV" },
  { id:6, name:"Toyota HiAce Cabin", company:"Toyota", type:"Grand Cabin", seats:13, img:"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80", price:"PKR 18,000", tag:"Family Cabin" },
];

// ─── AirportInput Component ───────────────────────────────────────────────────
function AirportInput({ label, value, onChange }) {
  const [query, setQuery]   = useState("");
  const [open, setOpen]     = useState(false);

  useEffect(() => {
    setQuery(value ? `${value.code} \u2013 ${value.city}, ${value.country}` : "");
  }, [value]);

  const q = query.toLowerCase();
  const filtered = q.length > 0
    ? AIRPORTS.filter(a =>
        a.code.toLowerCase().startsWith(q) ||
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
      ).slice(0, 10)
    : AIRPORTS.slice(0, 10);

  return (
    <div style={{ position:"relative" }}>
      <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>{label}</div>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); if (value) onChange(null); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        placeholder="Search airport or city..."
        style={{ width:"100%", border:"none", background:"transparent", outline:"none", fontSize:14, color:theme.text, fontFamily:"'DM Sans', sans-serif", padding:0 }}
      />
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 10px)", left:-16, right:-16, zIndex:9999, background:"#fff", border:`1px solid ${theme.border}`, borderRadius:14, boxShadow:"0 12px 40px rgba(0,0,0,0.14)", maxHeight:300, overflowY:"auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"14px 16px", color:theme.textMuted, fontSize:13 }}>No airports found</div>
          ) : filtered.map(airport => (
            <div
              key={airport.code}
              onMouseDown={e => { e.preventDefault(); onChange(airport); setOpen(false); }}
              style={{ padding:"10px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${theme.border}` }}
              onMouseEnter={e => e.currentTarget.style.background = theme.bgCard}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:theme.text }}>{airport.city}, {airport.country}</div>
                <div style={{ fontSize:11, color:theme.textMuted, marginTop:2 }}>{airport.name}</div>
              </div>
              <span style={{ fontWeight:800, fontSize:16, color:theme.accent, marginLeft:12, flexShrink:0 }}>{airport.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TravelersDropdown Component ──────────────────────────────────────────────
function TravelersDropdown({ travelers, onChange }) {
  const [open, setOpen] = useState(false);
  const total = travelers.adults + travelers.children + travelers.infants;

  const update = (type, delta) => {
    const min = type === "adults" ? 1 : 0;
    onChange({ ...travelers, [type]: Math.max(min, travelers[type] + delta) });
  };

  const travellerTypes = [
    { key:"adults",   label:"Adult",  sub:"12 years and above" },
    { key:"children", label:"Child",  sub:"2 to under 12 years" },
    { key:"infants",  label:"Infant", sub:"Under 2 years" },
  ];

  return (
    <div style={{ position:"relative" }}>
      <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Travelers</div>
      <div onClick={() => setOpen(!open)} style={{ cursor:"pointer", fontSize:14, color:theme.text, userSelect:"none", fontFamily:"'DM Sans', sans-serif" }}>
        {total} Traveler{total !== 1 ? "s" : ""}
        <span style={{ color:theme.textMuted, fontSize:12, marginLeft:6 }}>
          ({travelers.adults} Adult{travelers.adults !== 1 ? "s" : ""}
          {travelers.children > 0 ? `, ${travelers.children} Child${travelers.children !== 1 ? "ren" : ""}` : ""}
          {travelers.infants > 0 ? `, ${travelers.infants} Infant${travelers.infants !== 1 ? "s" : ""}` : ""})
        </span>
      </div>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 10px)", right:0, zIndex:9999, width:300, background:"#fff", border:`1px solid ${theme.border}`, borderRadius:16, boxShadow:"0 12px 40px rgba(0,0,0,0.14)", padding:20 }}>
          {travellerTypes.map(t => (
            <div key={t.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:theme.text }}>{t.label}</div>
                <div style={{ fontSize:11, color:theme.textMuted, marginTop:2 }}>{t.sub}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <button onMouseDown={e => { e.preventDefault(); update(t.key, -1); }}
                  style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${theme.border}`, background:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:theme.textMuted, fontWeight:300, lineHeight:1 }}>
                  −
                </button>
                <span style={{ minWidth:22, textAlign:"center", fontWeight:700, fontSize:15, color:theme.text }}>{travelers[t.key]}</span>
                <button onMouseDown={e => { e.preventDefault(); update(t.key, 1); }}
                  style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${theme.accent}`, background:theme.accent, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:300, lineHeight:1 }}>
                  +
                </button>
              </div>
            </div>
          ))}
          <button onMouseDown={e => { e.preventDefault(); setOpen(false); }}
            style={{ width:"100%", padding:"11px", background:theme.accent, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer", marginTop:4 }}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// ─── FlightPanel Component ────────────────────────────────────────────────────
function FlightPanel() {
  const [tripType, setTripType]   = useState("One Way");
  const [from, setFrom]           = useState(null);
  const [to, setTo]               = useState(null);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [travelers, setTravelers] = useState({ adults:1, children:0, infants:0 });
  const [multiCities, setMultiCities] = useState([
    { from:null, to:null, date:"" },
    { from:null, to:null, date:"" },
  ]);

  const today = new Date().toISOString().split("T")[0];

  const addCity = () => {
    if (multiCities.length < 5) setMultiCities([...multiCities, { from:null, to:null, date:"" }]);
  };
  const removeCity = i => {
    if (multiCities.length > 2) setMultiCities(multiCities.filter((_, idx) => idx !== i));
  };
  const updateMultiCity = (i, field, val) => {
    const c = [...multiCities]; c[i][field] = val; setMultiCities(c);
  };
  const swapAirports = () => { const t = from; setFrom(to); setTo(t); };

  const fieldBox = (children) => (
    <div style={{ padding:"14px 16px", background:"#fff", borderRadius:14, border:`1px solid ${theme.border}`, position:"relative" }}>
      {children}
    </div>
  );

  return (
    <div style={{ background:theme.bgCard, borderRadius:20, border:`1px solid ${theme.border}`, padding:"24px 28px", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
      {/* Trip Type */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["One Way","Return","Multi City"].map(type => (
          <button key={type} onClick={() => setTripType(type)} style={{
            padding:"8px 20px", borderRadius:50, fontSize:13, fontWeight:600, cursor:"pointer",
            border: tripType === type ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
            background: tripType === type ? "rgba(26,60,110,0.08)" : "#fff",
            color: tripType === type ? theme.accent : theme.textMuted,
            transition:"all 0.2s",
          }}>{type}</button>
        ))}
      </div>

      {tripType !== "Multi City" ? (
        <>
          {/* From / Swap / To */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 40px 1fr", gap:10, marginBottom:14, alignItems:"center" }}>
            {fieldBox(<AirportInput label="From" value={from} onChange={setFrom} />)}
            <button onClick={swapAirports} title="Swap airports" style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${theme.border}`, background:"#fff", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", transition:"transform 0.3s", color:theme.accent }} onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"} onMouseLeave={e=>e.currentTarget.style.transform="rotate(0deg)"}>
              ⇄
            </button>
            {fieldBox(<AirportInput label="To" value={to} onChange={setTo} />)}
          </div>

          {/* Dates / Class / Travelers */}
          <div style={{ display:"grid", gridTemplateColumns: tripType === "Return" ? "1fr 1fr 1.2fr 1.4fr" : "1fr 1.2fr 1.4fr", gap:10, marginBottom:20 }}>
            {fieldBox(
              <>
                <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Departure Date</div>
                <input type="date" min={today} value={departDate} onChange={e => setDepartDate(e.target.value)}
                  style={{ border:"none", background:"transparent", outline:"none", fontSize:14, color:theme.text, fontFamily:"'DM Sans', sans-serif", colorScheme:"light", width:"100%" }} />
              </>
            )}
            {tripType === "Return" && fieldBox(
              <>
                <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Return Date</div>
                <input type="date" min={departDate || today} value={returnDate} onChange={e => setReturnDate(e.target.value)}
                  style={{ border:"none", background:"transparent", outline:"none", fontSize:14, color:theme.text, fontFamily:"'DM Sans', sans-serif", colorScheme:"light", width:"100%" }} />
              </>
            )}
            {fieldBox(
              <>
                <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Cabin Class</div>
                <select value={cabinClass} onChange={e => setCabinClass(e.target.value)}
                  style={{ border:"none", background:"transparent", outline:"none", fontSize:14, color:theme.text, fontFamily:"'DM Sans', sans-serif", width:"100%", cursor:"pointer", appearance:"none" }}>
                  <option>Economy</option>
                  <option>Economy Premium</option>
                  <option>Business Class</option>
                  <option>First Class</option>
                </select>
              </>
            )}
            {fieldBox(<TravelersDropdown travelers={travelers} onChange={setTravelers} />)}
          </div>
        </>
      ) : (
        /* Multi City */
        <div style={{ marginBottom:20 }}>
          {multiCities.map((city, i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:10, marginBottom:10, alignItems:"center" }}>
              {fieldBox(<AirportInput label={`City ${i+1} From`} value={city.from} onChange={v => updateMultiCity(i,"from",v)} />)}
              {fieldBox(<AirportInput label={`City ${i+1} To`}   value={city.to}   onChange={v => updateMultiCity(i,"to",v)} />)}
              {fieldBox(
                <>
                  <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Date</div>
                  <input type="date" min={today} value={city.date} onChange={e => updateMultiCity(i,"date",e.target.value)}
                    style={{ border:"none", background:"transparent", outline:"none", fontSize:14, color:theme.text, fontFamily:"'DM Sans', sans-serif", colorScheme:"light", width:"100%" }} />
                </>
              )}
              <button onClick={() => removeCity(i)} style={{ width:36, height:36, borderRadius:"50%", border:"1px solid #fca5a5", background:"#fff5f5", cursor:"pointer", fontSize:18, color:"#ef4444", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
            </div>
          ))}
          {multiCities.length < 5 && (
            <button onClick={addCity} style={{ padding:"8px 20px", borderRadius:50, border:`1px dashed ${theme.accent}`, background:"transparent", color:theme.accent, fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:14 }}>+ Add City</button>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {fieldBox(
              <>
                <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Cabin Class</div>
                <select value={cabinClass} onChange={e => setCabinClass(e.target.value)}
                  style={{ border:"none", background:"transparent", outline:"none", fontSize:14, color:theme.text, fontFamily:"'DM Sans', sans-serif", width:"100%", cursor:"pointer", appearance:"none" }}>
                  <option>Economy</option>
                  <option>Economy Premium</option>
                  <option>Business Class</option>
                  <option>First Class</option>
                </select>
              </>
            )}
            {fieldBox(<TravelersDropdown travelers={travelers} onChange={setTravelers} />)}
          </div>
        </div>
      )}

      <button className="btn-primary" style={{ width:"100%", padding:"15px", borderRadius:14, fontSize:15, fontWeight:700 }}>
        Search Flights
      </button>
    </div>
  );
}

// ─── Hero Component ───────────────────────────────────────────────────────────
function Hero() {
  const [activeTab, setActiveTab] = useState("Flights");
  const tabs = ["Flights","Insurance"];

  const handleTabClick = (tab) => {
    if (tab === "Insurance") {
      window.location.hash = "#/insurance";
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <section style={{
      minHeight:"100vh",
      background:`radial-gradient(ellipse at 70% 30%, rgba(26,60,110,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(76,175,125,0.05) 0%, transparent 50%), ${theme.bg}`,
      padding:"120px 5% 80px",
      display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center",
    }} className="hero-grid">

      {/* Left Content */}
      <div>
        <h1 className="serif fade-up-delay1" style={{ fontSize:"clamp(42px, 5vw, 68px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-1px", marginBottom:24, color:theme.text }}>
          Discover Your<br /><span className="gradient-text">Umrah</span>{" "}<em>Package</em>
        </h1>
        <p className="fade-up-delay2" style={{ color:theme.textMuted, fontSize:16, lineHeight:1.75, maxWidth:440, marginBottom:36 }}>
          Plan unforgettable journeys with our expert Umrah travel guides — your perfect Umrah trip awaits.
        </p>
        <div className="fade-up-delay3" style={{ display:"flex", gap:14, marginBottom:48, flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={() => window.location.hash = "#/umrah"}>Explore Packages</button>
          <button className="btn-outline" style={{ display:"flex", alignItems:"center", gap:8, color:theme.text }}>
            <span style={{ width:32, height:32, borderRadius:"50%", background:"rgba(26,60,110,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>▶</span>
            Watch Video
          </button>
        </div>
        <div className="fade-up-delay4" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {[{ num:"10K+", label:"Happy Travelers" },{ num:"20+", label:"Destinations" },{ num:"5Yr", label:"Experience" }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:28, fontWeight:700, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{s.num}</div>
              <div style={{ fontSize:13, color:theme.textMuted, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Image */}
      <div style={{ position:"relative" }} className="fade-up-delay2">
        <div className="hero-image-wrap float-anim" style={{ height:480 }}>
          <img src="https://scontent.flhe3-2.fna.fbcdn.net/v/t39.30808-6/648106452_122114880333209329_4710445315082844352_n.png?_nc_cat=102&ccb=1-7&_nc_sid=2a1932&_nc_ohc=jTYChci6zIcQ7kNvwE9yl85&_nc_oc=Adkv4jV6vZpsOWfDhQdPv4fdTrExSj7SYVYaQP1p54PMkdBj7X8yt-HBFfClXc_SoyI&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&_nc_gid=2nCmH9BrzPt5eW4pCemgnA&_nc_ss=8&oh=00_Afyrm0_NbeWCRM1_XA1B2bZFu9pyTKmuQenH71yHYYdktQ&oe=69B4F9E2"
            alt="hero" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,10,15,0.3) 0%, transparent 50%)" }} />
        </div>
        <div className="parallax-badge" style={{ bottom:28, left:-32, animation:"scaleIn 0.6s 0.8s both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:28 }}>🕌</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:theme.text }}>Next Umrah</div>
              <div style={{ fontSize:11, color:theme.textMuted }}>Makkah & Madina</div>
            </div>
            <div style={{ marginLeft:8, background:theme.green, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20 }}>OPEN</div>
          </div>
        </div>
        <div className="parallax-badge" style={{ top:28, right:-24, animation:"slideLeft 0.6s 0.6s both" }}>
          <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4 }}>Rating</div>
          <div style={{ display:"flex", gap:2, fontSize:14, color:theme.accent }}>{"★★★★★"}</div>
          <div style={{ fontSize:13, fontWeight:600, marginTop:2, color:theme.text }}>4.98 / 5.0</div>
        </div>
      </div>

      {/* Bottom: Tabs + Flight/Insurance Panel */}
      <div style={{ gridColumn:"1 / -1" }}>
        <div style={{ display:"flex", gap:28, marginBottom:20 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => handleTabClick(tab)}
              style={{
                background:"none", border:"none",
                color: activeTab === tab ? theme.accent : theme.textMuted,
                fontSize:15, fontWeight:600, cursor:"pointer", paddingBottom:10,
                borderBottom: activeTab === tab ? `2px solid ${theme.accent}` : "2px solid transparent",
                fontFamily:"'DM Sans', sans-serif", transition:"color 0.2s",
                display:"flex", alignItems:"center", gap:6,
              }}>
              {tab === "Flights" ? "✈️" : "🛡️"} {tab}
            </button>
          ))}
        </div>
        {activeTab === "Flights" && <FlightPanel />}
      </div>
    </section>
  );
}

// ─── Umrah Section ────────────────────────────────────────────────────────────
function UmrahSection() {
  return (
    <section style={{ padding:"100px 5%", background:theme.bg }} id="umrah">
      <div style={{ textAlign:"center", marginBottom:52 }}>

        <h2 className="serif" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:700, marginBottom:16, color:theme.text }}>
          Umrah <span className="gradient-text">Packages</span>
        </h2>
        <p style={{ color:theme.textMuted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
          We offer carefully designed Umrah packages for every budget — from economy to luxury — including visa processing, flights, hotel accommodation, and transportation.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }} className="dest-grid">
        {umrahPackages.map((pkg, i) => (
          <div key={pkg.id} className="dest-card card-hover"
            style={{ borderRadius:20, overflow:"hidden", background:theme.bgCard, border:`1px solid ${theme.border}`, cursor:"pointer", animation:`fadeUp 0.6s ${i*0.1}s both` }}
            onClick={() => window.location.hash = "#/umrah"}>
            <div style={{ position:"relative", height:210, overflow:"hidden" }}>
              <img src={pkg.img} alt={pkg.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
              <span style={{ position:"absolute", top:14, right:14, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)", color:theme.accent, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, border:"1px solid rgba(26,60,110,0.3)" }}>{pkg.tag}</span>
              <span style={{ position:"absolute", top:14, left:14, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.5px" }}>{pkg.category}</span>
              <div style={{ position:"absolute", bottom:14, left:16 }}>
                <h3 style={{ fontSize:17, fontWeight:700, color:"#fff", margin:0, fontFamily:"'Playfair Display',serif" }}>{pkg.name}</h3>
              </div>
            </div>
            <div style={{ padding:"16px 18px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:19, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{pkg.price}</div>
                  <div style={{ fontSize:10, color:theme.textMuted }}>per person</div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:theme.text }}>⏱ {pkg.days}</div>
              </div>
              <div style={{ display:"flex", gap:12, alignItems:"center", paddingTop:12, borderTop:`1px solid ${theme.border}`, justifyContent:"space-between" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:13, color:theme.accent, fontWeight:700 }}>★ {pkg.rating}</span>
                  <span style={{ fontSize:12, color:theme.textMuted }}>({pkg.reviews} reviews)</span>
                </div>
                <span style={{ fontSize:11, color:theme.textMuted, background:theme.bgCard, border:`1px solid ${theme.border}`, padding:"3px 10px", borderRadius:20 }}>✈ Visa Included</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:48 }}>
        <button className="btn-outline" style={{ color:theme.text }} onClick={() => window.location.hash = "#/umrah"}>All Packages →</button>
      </div>
    </section>
  );
}

// ─── Car Rental Section ───────────────────────────────────────────────────────
function CarRentalSection() {
  return (
    <section style={{ padding:"100px 5%", background:theme.bgCard }} id="cars">
      <div style={{ textAlign:"center", marginBottom:52 }}>

        <h2 className="serif" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:700, marginBottom:16, color:theme.text }}>
          Book the <span className="gradient-text">Car You Love</span>
        </h2>
        <p style={{ color:theme.textMuted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
          From hatchbacks to coaches — 4 to 28 seats. Toyota, Honda, Suzuki and more. With driver or self drive — your choice!
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }} className="dest-grid">
        {carRentalHighlights.map((car, i) => (
          <div key={car.id} className="dest-card card-hover"
            style={{ borderRadius:20, overflow:"hidden", background:theme.bg, border:`1px solid ${theme.border}`, cursor:"pointer", animation:`fadeUp 0.6s ${i*0.1}s both` }}
            onClick={() => window.location.hash = "#/cars"}>
            <div style={{ position:"relative", height:200, overflow:"hidden" }}>
              <img src={car.img} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
              <span style={{ position:"absolute", top:12, right:12, background:"rgba(26,60,110,0.85)", backdropFilter:"blur(6px)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, textTransform:"uppercase" }}>{car.type}</span>
              <span style={{ position:"absolute", top:12, left:12, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>🪑 {car.seats} Seats</span>
              <div style={{ position:"absolute", bottom:14, left:16 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#fff", margin:0, fontFamily:"'Playfair Display',serif" }}>{car.name}</h3>
              </div>
            </div>
            <div style={{ padding:"14px 16px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:11, color:theme.accent, fontWeight:700, background:"rgba(26,60,110,0.08)", border:"1px solid rgba(26,60,110,0.15)", padding:"3px 10px", borderRadius:20 }}>{car.tag}</span>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:17, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{car.price}</div>
                  <div style={{ fontSize:10, color:theme.textMuted }}>per day</div>
                </div>
              </div>
              <div style={{ paddingTop:10, borderTop:`1px solid ${theme.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:theme.textMuted }}>🚗 {car.company} • With Driver Available</span>
                <span style={{ fontSize:11, color:"#16a34a", fontWeight:700, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", padding:"2px 8px", borderRadius:12 }}>✅ Available</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:48 }}>
        <button className="btn-outline" style={{ color:theme.text }} onClick={() => window.location.hash = "#/cars"}>All Cars →</button>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function Features() {
  return (
    <section style={{ padding:"100px 5%", background:`radial-gradient(ellipse at 30% 50%, rgba(26,60,110,0.05) 0%, transparent 60%), ${theme.bgCard}` }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }} className="hero-grid">
        <div>
          <h2 className="serif" style={{ fontSize:"clamp(30px,3.5vw,48px)", fontWeight:700, marginBottom:20, lineHeight:1.2, color:theme.text }}>
            Travel Smarter,<br /><span className="gradient-text">Live Better</span>
          </h2>
          <p style={{ color:theme.textMuted, lineHeight:1.75, marginBottom:36 }}>We believe travel changes lives. That's why we obsess over every detail — so you can focus on what matters: the moments that take your breath away.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {features.slice(0,4).map(f => (
              <div key={f.title} style={{ display:"flex", gap:16, alignItems:"start" }}>
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div style={{ fontWeight:600, marginBottom:4, color:theme.text }}>{f.title}</div>
                  <div style={{ fontSize:13, color:theme.textMuted, lineHeight:1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80","https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80","https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80"].map((img,i) => (
            <div key={i} style={{ borderRadius:16, overflow:"hidden", height:180, marginTop: i%2===1 ? 24 : 0 }}>
              <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }}
                onMouseEnter={e => e.target.style.transform="scale(1.05)"}
                onMouseLeave={e => e.target.style.transform="scale(1)"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Visa Section ─────────────────────────────────────────────────────────────
function VisaSection() {
  return (
    <section style={{ padding:"100px 5%", background:theme.bg }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>

        <h2 className="serif" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:700, marginBottom:16, color:theme.text }}>
          Get Your <span className="gradient-text">Visa</span> Hassle-Free
        </h2>
        <p style={{ color:theme.textMuted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
          We provide tourist visa services for 8+ countries with fast processing and a high approval rate. From documentation to application submission, Edafay handles the entire process for you.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }} className="dest-grid">
        {visasList.map((visa,i) => (
          <div key={visa.id} className="dest-card card-hover"
            style={{ borderRadius:20, overflow:"hidden", background:theme.bgCard, border:`1px solid ${theme.border}`, cursor:"pointer", animation:`fadeUp 0.6s ${i*0.1}s both` }}
            onClick={() => window.location.hash = "#/visas"}>
            <div style={{ position:"relative", height:180, overflow:"hidden" }}>
              <img src={visa.img} alt={visa.country} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              <span style={{ position:"absolute", top:12, right:14, fontSize:30, filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}>{visa.flag}</span>
              <span style={{ position:"absolute", top:14, left:14, background: visa.type==="Visa On Arrival" ? "rgba(34,197,94,0.75)" : visa.type.includes("e-Visa") ? "rgba(59,130,246,0.75)" : "rgba(0,0,0,0.55)", backdropFilter:"blur(6px)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.5px" }}>{visa.type}</span>
              <div style={{ position:"absolute", bottom:12, left:14 }}>
                <h3 style={{ fontSize:18, fontWeight:700, color:"#fff", margin:0, fontFamily:"'Playfair Display',serif" }}>{visa.country}</h3>
              </div>
            </div>
            <div style={{ padding:"14px 16px 16px" }}>
              <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:20, background:"rgba(26,60,110,0.1)", color:theme.accent, border:"1px solid rgba(26,60,110,0.25)" }}>⏱ {visa.processing}</span>
                <span style={{ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:20, background:"rgba(34,197,94,0.08)", color:"#16a34a", border:"1px solid rgba(34,197,94,0.2)" }}>✅ {visa.approvalRate}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:`1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize:10, color:theme.textMuted, marginBottom:2 }}>Starting from</div>
                  <div style={{ fontSize:17, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>
                    {visa.fee==="FREE" ? <span style={{ color:"#16a34a" }}>FREE ✓</span> : visa.fee}
                  </div>
                </div>
                <span style={{ fontSize:11, color:theme.textMuted, background:theme.bg, border:`1px solid ${theme.border}`, padding:"4px 12px", borderRadius:20, fontWeight:600 }}>Apply →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:48 }}>
        <button className="btn-outline" style={{ color:theme.text }} onClick={() => window.location.hash = "#/visas"}>All Visas →</button>
      </div>
    </section>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function Reviews() {
  return (
    <section style={{ padding:"100px 5%", background:theme.bgCard }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <h2 className="serif" style={{ fontSize:"clamp(30px,3.5vw,48px)", fontWeight:700, marginBottom:16, color:theme.text }}>What Our <span className="gradient-text">Travelers</span> Say</h2>
        <p style={{ color:theme.textMuted, maxWidth:460, margin:"0 auto", lineHeight:1.7 }}>Real stories from real adventures. Join 10,000+ happy pilgrims who have completed Umrah with Edafay.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }} className="three-col">
        {reviews.map((r,i) => (
          <div key={r.name} className="review-card" style={{ background:theme.bg, border:`1px solid ${theme.border}`, animation:`fadeUp 0.6s ${i*0.15}s both` }}>
            <div style={{ display:"flex", gap:4, marginBottom:16 }}>
              {Array(r.rating).fill(0).map((_,j) => <span key={j} style={{ color:theme.accent, fontSize:16 }}>★</span>)}
            </div>
            <p style={{ color:theme.textMuted, lineHeight:1.7, fontSize:14, marginBottom:20, fontStyle:"italic" }}>"{r.text}"</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <img src={r.img} alt={r.name} style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover", border:`2px solid ${theme.accent}` }} />
                <div>
                  <div style={{ fontWeight:600, fontSize:14, color:theme.text }}>{r.name}</div>
                  <div style={{ fontSize:12, color:theme.textMuted }}>{r.loc}</div>
                </div>
              </div>
              <div style={{ fontSize:11, color:theme.accent, background:"rgba(26,60,110,0.1)", padding:"4px 10px", borderRadius:20, border:"1px solid rgba(26,60,110,0.2)" }}>{r.tour}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{ padding:"100px 5%", background:`linear-gradient(135deg, rgba(26,60,110,0.08) 0%, rgba(76,175,125,0.05) 100%), ${theme.bg}`, textAlign:"center" }}>
      <div style={{ maxWidth:640, margin:"0 auto" }}>
        <h2 className="serif" style={{ fontSize:"clamp(32px,4vw,58px)", fontWeight:700, marginBottom:20, lineHeight:1.15, color:theme.text }}>Ready for Your<br />Next <span className="gradient-text">Trip?</span></h2>
        <p style={{ color:theme.textMuted, lineHeight:1.75, marginBottom:40, fontSize:16 }}>Join thousands of explorers who have discovered the world with Edafay. Subscribe and get exclusive deals, tips and early access.</p>
        <div style={{ display:"flex", gap:12, maxWidth:480, margin:"0 auto", background:"rgba(0,0,0,0.04)", border:`1px solid ${theme.border}`, borderRadius:50, padding:"6px 6px 6px 24px" }}>
          <input className="search-input" placeholder="Enter your email address" style={{ flex:1, color:theme.text }} />
          <button className="btn-primary" style={{ borderRadius:50, padding:"12px 28px", flexShrink:0 }}>Get Started</button>
        </div>
        <p style={{ color:theme.textMuted, fontSize:12, marginTop:14 }}>No spam, ever. Unsubscribe any time.</p>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="section-divider" />
      <UmrahSection />
      <div className="section-divider" />
      <CarRentalSection />
      <div className="section-divider" />
      <Features />
      <div className="section-divider" />
      <VisaSection />
      <div className="section-divider" />
      <Reviews />
      <CTA />
      <Footer />
    </>
  );
}