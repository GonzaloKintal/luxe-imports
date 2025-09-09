import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO_URI = process.env.MONGO_URI;

const products = [
  {
    title: "Auriculares Bluetooth Sony WH-1000XM4",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria, hasta 30 horas de batería, carga rápida y control táctil.",
    code: "SONYWH1000XM4",
    price: 89999,
    status: false,
    stock: 25,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=Sony+WH-1000XM4"]
  },
  {
    title: "Smart TV Samsung 55\" 4K UHD",
    description: "Televisor inteligente con resolución 4K, HDR, Tizen OS, control por voz y acceso a las principales apps de streaming.",
    code: "SAMSUNGTV55UHD",
    price: 299999,
    status: false,
    stock: 10,
    category: "Electrónica",
    thumbnails: ["https://placehold.co/250x250?text=Samsung+TV+55"]
  },
  {
    title: "Notebook Dell Inspiron 15 3000",
    description: "Notebook con procesador Intel Core i5, 8GB RAM, 512GB SSD, pantalla Full HD de 15.6 pulgadas y Windows 11.",
    code: "DELLINSP15",
    price: 420000,
    status: true,
    stock: 8,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=Dell+Inspiron+15"]
  },
  {
    title: "Cafetera Nespresso Vertuo Next",
    description: "Cafetera automática para cápsulas Nespresso Vertuo, con conectividad Bluetooth y Wi-Fi, y función de apagado automático.",
    code: "NESPRESSOVERTUO",
    price: 79999,
    status: false,
    stock: 15,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=Nespresso+Vertuo"]
  },
  {
    title: "Auriculares Inalámbricos JBL Tune 510BT",
    description: "Auriculares Bluetooth con sonido JBL Pure Bass, hasta 40 horas de batería y carga rápida.",
    code: "JBLTUNE510BT",
    price: 24999,
    status: true,
    stock: 30,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=JBL+Tune+510BT"]
  },
  {
    title: "Smartphone iPhone 14 Pro 256GB",
    description: "iPhone 14 Pro con pantalla Super Retina XDR de 6.1 pulgadas, triple cámara de 48MP, A16 Bionic y Face ID.",
    code: "IPHONE14PRO256",
    price: 999999,
    status: false,
    stock: 12,
    category: "Electrónica",
    thumbnails: ["https://placehold.co/250x250?text=iPhone+14+Pro"]
  },
  {
    title: "Tablet Samsung Galaxy Tab S8",
    description: "Tablet con pantalla de 11 pulgadas, 8GB RAM, 256GB de almacenamiento, S Pen incluido y batería de larga duración.",
    code: "GALAXYTABS8",
    price: 350000,
    status: true,
    stock: 18,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=Galaxy+Tab+S8"]
  },
  {
    title: "Aspiradora Robot Xiaomi Mi Vacuum Mop 2",
    description: "Robot aspirador con mapeo láser, control desde app, función de fregado y autonomía de 110 minutos.",
    code: "XIAOMIVACUUM2",
    price: 159999,
    status: false,
    stock: 9,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=Xiaomi+Vacuum+Mop+2"]
  },
  {
    title: "Parlante Bluetooth Bose SoundLink Revolve II",
    description: "Parlante portátil con sonido 360°, resistente al agua, hasta 13 horas de batería y manos libres.",
    code: "BOSESLREV2",
    price: 79999,
    status: true,
    stock: 20,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=Bose+Revolve+II"]
  },
  {
    title: "Monitor LG UltraWide 29\" FHD",
    description: "Monitor panorámico de 29 pulgadas, resolución Full HD, relación 21:9, ideal para multitarea y edición.",
    code: "LGULTRAWIDE29",
    price: 120000,
    status: true,
    stock: 7,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=LG+UltraWide+29"]
  },
  {
    title: "Heladera No Frost Whirlpool 400L",
    description: "Heladera con tecnología No Frost, freezer superior, eficiencia energética A+ y control electrónico.",
    code: "WHIRLPOOL400L",
    price: 350000,
    status: true,
    stock: 5,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=Whirlpool+400L"]
  },
  {
    title: "Auriculares Gamer HyperX Cloud II",
    description: "Auriculares con sonido envolvente 7.1, micrófono desmontable, almohadillas de memory foam y compatibilidad multiplataforma.",
    code: "HYPERXCLOUD2",
    price: 39999,
    status: true,
    stock: 22,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=HyperX+Cloud+II"]
  },
  {
    title: "Smartwatch Garmin Forerunner 245",
    description: "Reloj inteligente con GPS, monitoreo de frecuencia cardíaca, VO2 max, y hasta 7 días de batería.",
    code: "GARMIN245",
    price: 95000,
    status: true,
    stock: 14,
    category: "Electrónica",
    thumbnails: ["https://placehold.co/250x250?text=Garmin+245"]
  },
  {
    title: "Notebook MacBook Air M2 13\" 256GB",
    description: "MacBook Air con chip M2, pantalla Liquid Retina, 8GB RAM, 256GB SSD y autonomía de hasta 18 horas.",
    code: "MACBOOKAIRM2",
    price: 1200000,
    status: true,
    stock: 6,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=MacBook+Air+M2"]
  },
  {
    title: "Lavarropas Samsung 9kg EcoBubble",
    description: "Lavarropas automático con tecnología EcoBubble, 14 programas, motor Digital Inverter y panel LED.",
    code: "SAMSUNG9KG",
    price: 210000,
    status: true,
    stock: 8,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=Samsung+9kg"]
  },
  {
    title: "Auriculares Bluetooth Apple AirPods Pro 2da Gen",
    description: "Auriculares con cancelación activa de ruido, modo transparencia, chip H2 y estuche de carga MagSafe.",
    code: "AIRPODSPRO2",
    price: 139999,
    status: true,
    stock: 16,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=AirPods+Pro+2"]
  },
  {
    title: "Smartphone Google Pixel 7 128GB",
    description: "Google Pixel 7 con pantalla OLED de 6.3 pulgadas, procesador Tensor G2, cámara dual de 50MP y Android 13.",
    code: "PIXEL7128",
    price: 799999,
    status: true,
    stock: 11,
    category: "Electrónica",
    thumbnails: ["https://placehold.co/250x250?text=Pixel+7"]
  },
  {
    title: "Tablet Apple iPad 10ma Gen 64GB",
    description: "iPad de 10ma generación con pantalla Liquid Retina de 10.9 pulgadas, chip A14 Bionic y Touch ID.",
    code: "IPAD10GEN64",
    price: 450000,
    status: true,
    stock: 13,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=iPad+10th+Gen"]
  },
  {
    title: "Microondas BGH Quick Chef 30L",
    description: "Microondas digital con 8 menús automáticos, función grill, descongelado por peso y display LED.",
    code: "BGH30L",
    price: 65000,
    status: true,
    stock: 17,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=BGH+30L"]
  },
  {
    title: "Parlante JBL Flip 6",
    description: "Parlante Bluetooth portátil, resistente al agua, hasta 12 horas de batería y sonido JBL Original Pro.",
    code: "JBLFLIP6",
    price: 49999,
    status: true,
    stock: 19,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=JBL+Flip+6"]
  },
  {
    title: "Smart TV LG 50\" 4K UHD",
    description: "Televisor inteligente con panel IPS, webOS, control por voz y compatibilidad con Alexa y Google Assistant.",
    code: "LGTV50UHD",
    price: 259999,
    status: true,
    stock: 9,
    category: "Electrónica",
    thumbnails: ["https://placehold.co/250x250?text=LG+TV+50"]
  },
  {
    title: "Notebook Lenovo IdeaPad 3 15\"",
    description: "Notebook con procesador AMD Ryzen 5, 8GB RAM, 512GB SSD, pantalla Full HD y Windows 11.",
    code: "LENOVOIP315",
    price: 380000,
    status: true,
    stock: 10,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=Lenovo+IdeaPad+3"]
  },
  {
    title: "Aire Acondicionado Philco 3500W Frío/Calor",
    description: "Aire acondicionado split con función frío/calor, eficiencia energética A y control remoto.",
    code: "PHILCO3500W",
    price: 220000,
    status: true,
    stock: 7,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=Philco+3500W"]
  },
  {
    title: "Auriculares Bluetooth Sennheiser HD 450BT",
    description: "Auriculares inalámbricos con cancelación activa de ruido, hasta 30 horas de batería y control por app.",
    code: "SENNHEISER450BT",
    price: 69999,
    status: true,
    stock: 14,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=Sennheiser+450BT"]
  },
  {
    title: "Smartphone Motorola Edge 30 256GB",
    description: "Motorola Edge 30 con pantalla OLED de 6.5 pulgadas, cámara triple de 50MP y carga TurboPower.",
    code: "MOTOEDGE30",
    price: 599999,
    status: true,
    stock: 13,
    category: "Electrónica",
    thumbnails: ["https://placehold.co/250x250?text=Edge+30"]
  },
  {
    title: "Tablet Lenovo Tab M10 Plus 128GB",
    description: "Tablet con pantalla de 10.3 pulgadas, 4GB RAM, 128GB de almacenamiento y batería de larga duración.",
    code: "LENOVOTABM10",
    price: 180000,
    status: true,
    stock: 12,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=Lenovo+Tab+M10"]
  },
  {
    title: "Cafetera Oster PrimaLatte Touch",
    description: "Cafetera espresso automática con pantalla táctil, depósito de leche y función de autolimpieza.",
    code: "OSTERPRIMALATTE",
    price: 95000,
    status: true,
    stock: 11,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=Oster+PrimaLatte"]
  },
  {
    title: "Auriculares Bluetooth Beats Studio3",
    description: "Auriculares con cancelación de ruido, chip Apple W1, hasta 22 horas de batería y diseño plegable.",
    code: "BEATSSTUDIO3",
    price: 119999,
    status: true,
    stock: 8,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=Beats+Studio3"]
  },
  {
    title: "Smart TV Philips 43\" 4K UHD",
    description: "Televisor con sistema operativo Saphi, HDR10+, Ambilight y control por voz.",
    code: "PHILIPS43UHD",
    price: 189999,
    status: true,
    stock: 10,
    category: "Electrónica",
    thumbnails: ["https://placehold.co/250x250?text=Philips+43"]
  },
  {
    title: "Notebook HP Pavilion 14\"",
    description: "Notebook con procesador Intel Core i7, 16GB RAM, 1TB SSD, pantalla Full HD y Windows 11.",
    code: "HPPAV14",
    price: 650000,
    status: true,
    stock: 6,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=HP+Pavilion+14"]
  },
  {
    title: "Aspiradora Philips PowerPro Compact",
    description: "Aspiradora sin bolsa, tecnología PowerCyclone 5, filtro HEPA y depósito de 1.5L.",
    code: "PHILIPSCOMPACT",
    price: 55000,
    status: true,
    stock: 15,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=Philips+Compact"]
  },
  {
    title: "Auriculares Bluetooth Skullcandy Crusher Evo",
    description: "Auriculares con bajos personalizables, hasta 40 horas de batería y carga rápida.",
    code: "SKULLCANDYEVO",
    price: 79999,
    status: true,
    stock: 9,
    category: "Audio",
    thumbnails: ["https://placehold.co/250x250?text=Skullcandy+Evo"]
  },
  {
    title: "Smartphone Xiaomi Redmi Note 12 Pro",
    description: "Redmi Note 12 Pro con pantalla AMOLED de 6.67 pulgadas, cámara cuádruple de 108MP y carga rápida de 67W.",
    code: "REDMINOTE12PRO",
    price: 420000,
    status: true,
    stock: 14,
    category: "Electrónica",
    thumbnails: ["https://placehold.co/250x250?text=Redmi+Note+12+Pro"]
  },
  {
    title: "Tablet Amazon Fire HD 10",
    description: "Tablet con pantalla Full HD de 10.1 pulgadas, 3GB RAM, 64GB de almacenamiento y Alexa integrada.",
    code: "FIREHD10",
    price: 120000,
    status: true,
    stock: 10,
    category: "Computación",
    thumbnails: ["https://placehold.co/250x250?text=Fire+HD+10"]
  },
  {
    title: "Cafetera Dolce Gusto Genio S Plus",
    description: "Cafetera automática para cápsulas, 4 niveles de temperatura, modo espresso boost y apagado automático.",
    code: "DOLCEGUSTOSPLUS",
    price: 65000,
    status: true,
    stock: 13,
    category: "Hogar",
    thumbnails: ["https://placehold.co/250x250?text=Dolce+Gusto+S+Plus"]
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log('Base de datos reseteada y 35 productos creados.');
  await mongoose.disconnect();
}

seed();