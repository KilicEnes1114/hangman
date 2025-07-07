const kelimeler = [
  "kod", "html", "css", "veri", "ram", "cpu", "disk", "usb",
  "modem", "mouse", "ekran", "yazici", "sifre", "klavye", "tarayici", "sunucu",
  "program", "komut", "yazilim", "donanim", "bilgisayar", "algoritma", "android",
  "uygulama", "web", "internet", "server", "istemci", "buton", "form", "link",
  "paket", "port", "dizin", "adres", "domain", "kodlama", "robot", 
  "güvenlik", "firewall", "veritabani", "piksel", "tasarim", "script", "kodcu"
];

const adamGorselleri = [
  "",
  "O",
  "O\n|",
  "O\n/|",
  "O\n/|\\",
  "O\n/|\\\n/",
  "O\n/|\\\n/ \\"
];

const harfEsleme = {
  "i": ["ı", "i"], "ı": ["ı", "i"],
  "s": ["s", "ş"], "ş": ["s", "ş"],
  "c": ["c", "ç"], "ç": ["c", "ç"],
  "g": ["g", "ğ"], "ğ": ["g", "ğ"],
  "o": ["o", "ö"], "ö": ["o", "ö"],
  "u": ["u", "ü"], "ü": ["u", "ü"]
};

let secilenKelime = "";
let dogruHarfler = [];
let yanlisSayisi = 0;
let skor = 0;
let oyuncuAdi = "";
let harfAlindi = false;
let harfDegistirHak = 2;
let oncekiKelime = "";
let kelimeSayaci = 0;
const maxKelime = 3;

const kelimeDiv = document.getElementById("kelime");
const harflerDiv = document.getElementById("harfler");
const adamDiv = document.getElementById("adam");
const harfAlBtn = document.getElementById("harfAlBtn");
const harfDegistirBtn = document.getElementById("harfDegistirBtn");
const anlikSkorDiv = document.getElementById("anlikSkor");
const skorListesi = document.getElementById("skorListesi");

function baslat() {
  const input = document.getElementById("isimInput").value.trim();
  const hazirIsimler = ["Kartal", "ByteKral", "JSReis", "Admin", "CoderBJK"];
  oyuncuAdi = input !== "" ? input : hazirIsimler[Math.floor(Math.random() * hazirIsimler.length)];

  skor = 0;
  kelimeSayaci = 0;
  yeniKelimeBaslat();
}

function yeniKelimeBaslat() {
  secilenKelime = secilenYeniKelime();
  dogruHarfler = [];
  yanlisSayisi = 0;
  harfAlindi = false;
  harfDegistirHak = 2;

  document.getElementById("baslangic").style.display = "none";
  document.getElementById("oyun").style.display = "block";

  harfAlBtn.disabled = false;
  harfAlBtn.textContent = "🪄 Harf Al (1)";
  harfDegistirBtn.disabled = false;
  harfDegistirBtn.textContent = "🔄 Harf Değiştir (2)";

  gosterKelime();
  harfleriOlustur();
  adamDiv.textContent = "";
  anlikSkorGuncelle();
  skorbordGoster();
}

function secilenYeniKelime() {
  let yeniKelime;
  do {
    yeniKelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];
  } while (yeniKelime === oncekiKelime);
  oncekiKelime = yeniKelime;
  return yeniKelime;
}

function harfEslesirMi(girilen, gercek) {
  const grup1 = harfEsleme[girilen] || [girilen];
  const grup2 = harfEsleme[gercek] || [gercek];
  return grup1.some(h => grup2.includes(h));
}

function gosterKelime() {
  const goruntu = secilenKelime
    .split("")
    .map(harf => dogruHarfler.some(g => harfEslesirMi(g, harf)) ? harf : "_")
    .join(" ");
  kelimeDiv.textContent = goruntu;
}

function harfleriOlustur() {
  harflerDiv.innerHTML = "";
  const alfabe = "abcçdefgğhıijklmnoöprsştuüvyz";
  for (let harf of alfabe) {
    const btn = document.createElement("button");
    btn.textContent = harf;
    btn.onclick = () => harfTiklandi(harf, btn);
    harflerDiv.appendChild(btn);
  }
}

function harfTiklandi(harf, btn) {
  btn.disabled = true;

  const eslesenVarMi = secilenKelime
    .split("")
    .some(k => harfEslesirMi(harf, k));

  if (eslesenVarMi) {
    dogruHarfler.push(harf);
    skor += 10;
    anlikSkorGuncelle();
    gosterKelime();

    if (!kelimeDiv.textContent.includes("_")) {
      skor += 50;
      bitirOyun(true);
    }
  } else {
    yanlisSayisi++;
    skor -= 5;
    anlikSkorGuncelle();
    adamDiv.textContent = adamGorselleri[yanlisSayisi];

    if (yanlisSayisi === adamGorselleri.length - 1) {
      bitirOyun(false);
    }
  }
}

function harfAl() {
  if (harfAlindi) return;

  const kalanHarfler = secilenKelime
    .split("")
    .filter(h => !dogruHarfler.some(g => harfEslesirMi(g, h)));

  if (kalanHarfler.length > 0) {
    const rastgele = kalanHarfler[Math.floor(Math.random() * kalanHarfler.length)];
    const btnler = harflerDiv.querySelectorAll("button");

    btnler.forEach(btn => {
      if (harfEslesirMi(btn.textContent, rastgele) && !btn.disabled) {
        btn.click();
      }
    });

    harfAlBtn.disabled = true;
    harfAlindi = true;
  }
}

function harfDegistir() {
  if (harfDegistirHak <= 0) return;

  const kalanButonlar = Array.from(harflerDiv.querySelectorAll("button")).filter(btn => !btn.disabled);
  if (kalanButonlar.length === 0) return;

  const rastgeleEski = kalanButonlar[Math.floor(Math.random() * kalanButonlar.length)];
  rastgeleEski.disabled = true;

  const alfabe = "abcçdefgğhıijklmnoöprsştuüvyz".split("");
  const kullanilmayan = alfabe.filter(harf =>
    !Array.from(harflerDiv.querySelectorAll("button")).some(btn => btn.textContent === harf && !btn.disabled)
  );

  if (kullanilmayan.length === 0) return;

  const yeniHarf = kullanilmayan[Math.floor(Math.random() * kullanilmayan.length)];
  const yeniBtn = document.createElement("button");
  yeniBtn.textContent = yeniHarf;
  yeniBtn.onclick = () => harfTiklandi(yeniHarf, yeniBtn);
  harflerDiv.appendChild(yeniBtn);

  harfDegistirHak--;
  if (harfDegistirHak === 0) harfDegistirBtn.disabled = true;
  harfDegistirBtn.textContent = `🔄 Harf Değiştir (${harfDegistirHak})`;
}

function harfleriKapat() {
  harflerDiv.querySelectorAll("button").forEach(btn => btn.disabled = true);
  harfAlBtn.disabled = true;
  harfDegistirBtn.disabled = true;
}

function bitirOyun(kazandin) {
  harfleriKapat();

  const sonuc = kazandin ? `🎉 Tebrikler ${oyuncuAdi}, kelimeyi buldun!` : `😵 Üzgünüm ${oyuncuAdi}, kaybettin!`;
  alert(`${sonuc}\nKelime: ${secilenKelime}\nSkorun: ${skor}`);

  kelimeSayaci++;

  if (kelimeSayaci < maxKelime) {
    setTimeout(() => yeniKelimeBaslat(), 1000);
  } else {
    alert(`🎮 Oyun Bitti!\nToplam skorun: ${skor}`);
    skoruKaydet(oyuncuAdi, skor);
    skorbordGoster();
    document.getElementById("oyun").style.display = "none";
    document.getElementById("baslangic").style.display = "block";
  }
}

function anlikSkorGuncelle() {
  anlikSkorDiv.textContent = `${oyuncuAdi} | Anlık Skor: ${skor}`;
}

function skoruKaydet(isim, skor) {
  const skorlar = JSON.parse(localStorage.getItem("skorbord") || "[]");
  skorlar.push({ isim, skor });
  localStorage.setItem("skorbord", JSON.stringify(skorlar));
}

function skorbordGoster() {
  const skorlar = JSON.parse(localStorage.getItem("skorbord") || "[]");
  skorlar.sort((a, b) => b.skor - a.skor);
  skorListesi.innerHTML = "";
  skorlar.forEach((s, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} ${s.isim} - ${s.skor} puan`;
    if (s.isim === oyuncuAdi) {
      li.style.fontWeight = "bold";
      li.style.color = "darkred";
    }
    skorListesi.appendChild(li);
  });
}

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key.toLowerCase() === ".") {
    e.preventDefault();
    console.clear();
    console.log("%c🤫 Gizli Kelime: " + secilenKelime, "color: darkgreen; font-size: 16px; font-weight: bold;");
  }
});

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key.toLowerCase() === "x") {
    e.preventDefault();
    console.clear();
    console.log("%c🤫 Gizli Kelime: " + secilenKelime, "color: darkgreen; font-size: 16px; font-weight: bold;");
  }
});



document.addEventListener("keydown", function (e) {
  const harf = e.key.toLowerCase();
  if (/^[a-zğüşöçı]$/.test(harf)) {
    const butonlar = Array.from(harflerDiv.querySelectorAll("button"));
    const uygunButon = butonlar.find(btn => btn.textContent === harf && !btn.disabled);
    if (uygunButon) {
      uygunButon.click();
    }
  }

  if (e.key === "h") {
    harfAl(); // H tuşu → harf al
  }

  if (e.key === "d") {
    harfDegistir(); // D tuşu → harf değiştir
  }
});
